import Timetable from '../models/Timetable';
import Teacher from '../models/Teacher';
import OptimizationLog from '../models/OptimizationLog';

interface TimeSlot {
  startTime: string;
  endTime: string;
  dayOfWeek: string;
}

interface Conflict {
  type: 'teacher_clash' | 'hall_double_booking' | 'teacher_absence';
  classes: any[];
  description: string;
}

class TimetableOptimizer {
  private availableHalls = ['A101', 'A102', 'A103', 'B101', 'B102', 'B103', 'C101', 'C102'];
  
  async detectConflicts(): Promise<Conflict[]> {
    const timetables = await Timetable.find().populate('teacher');
    const conflicts: Conflict[] = [];

    // Check for teacher clashes (same teacher in two halls at same time)
    const teacherSchedule = new Map();
    
    timetables.forEach(slot => {
      const teacher = slot.teacher as any;
      const key = `${teacher._id}-${slot.dayOfWeek}-${slot.startTime}-${slot.endTime}`;
      
      if (teacherSchedule.has(key)) {
        conflicts.push({
          type: 'teacher_clash',
          classes: [slot, teacherSchedule.get(key)],
          description: `Teacher ${teacher.firstName} has clash: ${slot.subject} and ${teacherSchedule.get(key).subject}`
        });
      }
      
      teacherSchedule.set(key, slot);
    });

    // Check for hall double bookings
    const hallSchedule = new Map();
    
    timetables.forEach(slot => {
      const key = `${slot.hall}-${slot.dayOfWeek}-${slot.startTime}-${slot.endTime}`;
      
      if (hallSchedule.has(key)) {
        conflicts.push({
          type: 'hall_double_booking',
          classes: [slot, hallSchedule.get(key)],
          description: `Hall ${slot.hall} is double-booked at ${slot.startTime}`
        });
      }
      
      hallSchedule.set(key, slot);
    });

    return conflicts;
  }

  async resolveConflicts(conflicts: Conflict[]): Promise<any[]> {
    const resolutions: any[] = [];

    for (const conflict of conflicts) {
      if (conflict.type === 'hall_double_booking') {
        const resolution = await this.resolveHallClash(conflict);
        resolutions.push(resolution);
      } else if (conflict.type === 'teacher_clash') {
        const resolution = await this.resolveTeacherClash(conflict);
        resolutions.push(resolution);
      }
    }

    return resolutions;
  }

  private async resolveHallClash(conflict: Conflict): Promise<any> {
    const [class1, class2] = conflict.classes;
    
    // Try to reassign class2 to an available hall
    const availableHall = await this.findAvailableHall(
      class2.dayOfWeek,
      class2.startTime,
      class2.endTime,
      class2.hall
    );

    if (availableHall) {
      await Timetable.findByIdAndUpdate(class2._id, { hall: availableHall });
      
      await OptimizationLog.create({
        conflictType: 'hall_double_booking',
        originalTimetable: { ...class2.toObject() },
        resolvedTimetable: { ...class2.toObject(), hall: availableHall },
        resolution: `Reassigned class from ${class2.hall} to ${availableHall}`,
        status: 'success'
      });

      return {
        success: true,
        action: 'hall_reassignment',
        classId: class2._id,
        newHall: availableHall
      };
    }

    return {
      success: false,
      action: 'failed_resolution',
      conflict: conflict.description
    };
  }

  private async resolveTeacherClash(conflict: Conflict): Promise<any> {
    const [class1, class2] = conflict.classes;
    
    // Try to find substitute teacher
    const substituteTeacher = await this.findSubstituteTeacher(
      class2.subject,
      class2.dayOfWeek,
      class2.startTime,
      class2.endTime
    );

    if (substituteTeacher) {
      await Timetable.findByIdAndUpdate(class2._id, { teacher: substituteTeacher._id });
      
      await OptimizationLog.create({
        conflictType: 'teacher_clash',
        originalTimetable: { ...class2.toObject() },
        resolvedTimetable: { ...class2.toObject(), teacher: substituteTeacher._id },
        resolution: `Assigned substitute teacher ${substituteTeacher.firstName}`,
        status: 'success'
      });

      return {
        success: true,
        action: 'teacher_reassignment',
        classId: class2._id,
        newTeacher: substituteTeacher._id,
        teacherName: `${substituteTeacher.firstName} ${substituteTeacher.lastName}`
      };
    }

    // If no substitute, try to reschedule the class
    return {
      success: false,
      action: 'pending_manual_review',
      conflict: conflict.description
    };
  }

  private async findAvailableHall(
    dayOfWeek: string,
    startTime: string,
    endTime: string,
    excludeHall: string
  ): Promise<string | null> {
    for (const hall of this.availableHalls) {
      if (hall === excludeHall) continue;

      const conflictingSlot = await Timetable.findOne({
        hall,
        dayOfWeek,
        startTime,
        endTime
      });

      if (!conflictingSlot) {
        return hall;
      }
    }

    return null;
  }

  private async findSubstituteTeacher(
    subject: string,
    dayOfWeek: string,
    startTime: string,
    endTime: string
  ): Promise<any> {
    const teachers = await Teacher.find({ subjects: subject }).populate('userId');

    for (const teacher of teachers) {
      const hasConflict = await Timetable.findOne({
        teacher: teacher._id,
        dayOfWeek,
        startTime,
        endTime
      });

      if (!hasConflict) {
        return teacher.userId;
      }
    }

    return null;
  }
}

export default new TimetableOptimizer();
