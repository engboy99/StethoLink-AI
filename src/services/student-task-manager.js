const { logger } = require('../utils/logger');

class StudentTaskManager {
  constructor() {
    this.studentTasks = new Map();
    this.studentNotebooks = new Map();
    this.taskAlerts = new Map();
    this.taskCategories = this.initializeTaskCategories();
    this.notebookCategories = this.initializeNotebookCategories();
  }

  // Initialize Task Categories
  initializeTaskCategories() {
    return {
      'academic': {
        name: 'Academic',
        color: 'blue',
        icon: '📚',
        subcategories: ['Study Session', 'Exam Preparation', 'Assignment', 'Research', 'Presentation']
      },
      'clinical': {
        name: 'Clinical',
        color: 'green',
        icon: '🏥',
        subcategories: ['Ward Rounds', 'Patient Consultation', 'Procedure Practice', 'Case Study', 'Clinical Rotation']
      },
      'emergency': {
        name: 'Emergency',
        color: 'red',
        icon: '🚨',
        subcategories: ['Emergency Call', 'Trauma Case', 'Critical Care', 'Resuscitation', 'Emergency Protocol']
      },
      'personal': {
        name: 'Personal',
        color: 'purple',
        icon: '👤',
        subcategories: ['Break', 'Meal', 'Exercise', 'Rest', 'Personal Study']
      },
      'career': {
        name: 'Career Development',
        color: 'orange',
        icon: '🎯',
        subcategories: ['Career Planning', 'Certification', 'Workshop', 'Conference', 'Networking']
      }
    };
  }

  // Initialize Notebook Categories
  initializeNotebookCategories() {
    return {
      'clinical_notes': {
        name: 'Clinical Notes',
        color: 'blue',
        icon: '🏥',
        description: 'Patient cases and clinical observations'
      },
      'study_notes': {
        name: 'Study Notes',
        color: 'green',
        icon: '📚',
        description: 'Academic notes and study materials'
      },
      'procedure_notes': {
        name: 'Procedure Notes',
        color: 'red',
        icon: '💉',
        description: 'Medical procedures and techniques'
      },
      'research_notes': {
        name: 'Research Notes',
        color: 'purple',
        icon: '🔬',
        description: 'Research findings and literature review'
      },
      'personal_notes': {
        name: 'Personal Notes',
        color: 'orange',
        icon: '👤',
        description: 'Personal reflections and goals'
      }
    };
  }

  // Add Student Task
  addTask(studentId, taskData) {
    try {
      const {
        title,
        description,
        category,
        subcategory,
        priority,
        scheduledTime,
        duration,
        location,
        notes,
        alertTimes
      } = taskData;

      if (!title || !scheduledTime) {
        throw new Error('Title and scheduled time are required');
      }

      const task = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        studentId,
        title,
        description: description || '',
        category: category || 'personal',
        subcategory: subcategory || 'General',
        priority: priority || 'medium',
        scheduledTime: new Date(scheduledTime),
        duration: duration || 60, // minutes
        location: location || '',
        notes: notes || '',
        alertTimes: alertTimes || ['30min', '15min', '5min'],
        status: 'pending',
        createdAt: new Date(),
        completedAt: null,
        alerts: []
      };

      // Calculate end time
      task.endTime = new Date(task.scheduledTime.getTime() + (task.duration * 60 * 1000));

      // Set up alerts
      this.setupTaskAlerts(task);

      // Store task
      if (!this.studentTasks.has(studentId)) {
        this.studentTasks.set(studentId, []);
      }
      this.studentTasks.get(studentId).push(task);

      logger.info('📅 Student task added', { 
        studentId, 
        taskId: task.id, 
        title, 
        scheduledTime: task.scheduledTime 
      });

      return task;
    } catch (error) {
      logger.error('❌ Error adding student task:', error);
      throw error;
    }
  }

  // Setup Task Alerts
  setupTaskAlerts(task) {
    const alertTimes = task.alertTimes;
    const scheduledTime = task.scheduledTime;

    alertTimes.forEach(alertType => {
      let alertTime;
      
      switch (alertType) {
        case '30min':
          alertTime = new Date(scheduledTime.getTime() - 30 * 60 * 1000);
          break;
        case '15min':
          alertTime = new Date(scheduledTime.getTime() - 15 * 60 * 1000);
          break;
        case '5min':
          alertTime = new Date(scheduledTime.getTime() - 5 * 60 * 1000);
          break;
        case 'exact':
          alertTime = scheduledTime;
          break;
        default:
          return;
      }

      const alert = {
        id: `alert_${task.id}_${alertType}`,
        taskId: task.id,
        studentId: task.studentId,
        alertType,
        alertTime,
        message: `${alertType} alert: ${task.title}`,
        status: 'pending',
        taskTitle: task.title,
        taskLocation: task.location,
        priority: task.priority
      };

      if (!this.taskAlerts.has(task.studentId)) {
        this.taskAlerts.set(task.studentId, []);
      }
      this.taskAlerts.get(task.studentId).push(alert);
    });
  }

  // Get Student Tasks
  getTasks(studentId, filters = {}) {
    try {
      const tasks = this.studentTasks.get(studentId) || [];
      let filteredTasks = tasks;

      // Apply filters
      if (filters.status) {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status);
      }
      if (filters.category) {
        filteredTasks = filteredTasks.filter(task => task.category === filters.category);
      }
      if (filters.priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
      }
      if (filters.date) {
        const filterDate = new Date(filters.date);
        filteredTasks = filteredTasks.filter(task => 
          task.scheduledTime.toDateString() === filterDate.toDateString()
        );
      }

      // Sort by scheduled time
      filteredTasks.sort((a, b) => a.scheduledTime - b.scheduledTime);

      return {
        tasks: filteredTasks,
        total: filteredTasks.length,
        pending: filteredTasks.filter(t => t.status === 'pending').length,
        completed: filteredTasks.filter(t => t.status === 'completed').length,
        overdue: filteredTasks.filter(t => t.status === 'pending' && t.scheduledTime < new Date()).length
      };
    } catch (error) {
      logger.error('❌ Error getting student tasks:', error);
      throw error;
    }
  }

  // Update Task
  updateTask(studentId, taskId, updates) {
    try {
      const tasks = this.studentTasks.get(studentId);
      if (!tasks) {
        throw new Error('No tasks found for student');
      }

      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      const task = tasks[taskIndex];
      const updatedTask = { ...task, ...updates, updatedAt: new Date() };

      // If scheduled time changed, update alerts
      if (updates.scheduledTime) {
        updatedTask.scheduledTime = new Date(updates.scheduledTime);
        updatedTask.endTime = new Date(updatedTask.scheduledTime.getTime() + (updatedTask.duration * 60 * 1000));
        this.updateTaskAlerts(updatedTask);
      }

      tasks[taskIndex] = updatedTask;

      logger.info('📅 Student task updated', { studentId, taskId, updates: Object.keys(updates) });
      return updatedTask;
    } catch (error) {
      logger.error('❌ Error updating student task:', error);
      throw error;
    }
  }

  // Update Task Alerts
  updateTaskAlerts(task) {
    // Remove old alerts
    const alerts = this.taskAlerts.get(task.studentId) || [];
    const filteredAlerts = alerts.filter(alert => alert.taskId !== task.id);
    this.taskAlerts.set(task.studentId, filteredAlerts);

    // Set up new alerts
    this.setupTaskAlerts(task);
  }

  // Complete Task
  completeTask(studentId, taskId) {
    try {
      const tasks = this.studentTasks.get(studentId);
      if (!tasks) {
        throw new Error('No tasks found for student');
      }

      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      const task = tasks[taskIndex];
      task.status = 'completed';
      task.completedAt = new Date();

      // Remove pending alerts
      const alerts = this.taskAlerts.get(studentId) || [];
      const filteredAlerts = alerts.filter(alert => alert.taskId !== taskId);
      this.taskAlerts.set(studentId, filteredAlerts);

      logger.info('📅 Student task completed', { studentId, taskId, title: task.title });
      return task;
    } catch (error) {
      logger.error('❌ Error completing student task:', error);
      throw error;
    }
  }

  // Delete Task
  deleteTask(studentId, taskId) {
    try {
      const tasks = this.studentTasks.get(studentId);
      if (!tasks) {
        throw new Error('No tasks found for student');
      }

      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      const deletedTask = tasks.splice(taskIndex, 1)[0];

      // Remove alerts
      const alerts = this.taskAlerts.get(studentId) || [];
      const filteredAlerts = alerts.filter(alert => alert.taskId !== taskId);
      this.taskAlerts.set(studentId, filteredAlerts);

      logger.info('📅 Student task deleted', { studentId, taskId, title: deletedTask.title });
      return deletedTask;
    } catch (error) {
      logger.error('❌ Error deleting student task:', error);
      throw error;
    }
  }

  // Get Task Alerts
  getTaskAlerts(studentId) {
    try {
      const alerts = this.taskAlerts.get(studentId) || [];
      const now = new Date();

      // Filter alerts that are due or overdue
      const dueAlerts = alerts.filter(alert => 
        alert.status === 'pending' && alert.alertTime <= now
      );

      // Mark alerts as triggered
      dueAlerts.forEach(alert => {
        alert.status = 'triggered';
      });

      return {
        alerts: dueAlerts,
        total: dueAlerts.length,
        pending: alerts.filter(a => a.status === 'pending').length,
        triggered: alerts.filter(a => a.status === 'triggered').length
      };
  } catch (error) {
    logger.error('❌ Error getting task alerts:', error);
    throw error;
  }
}

  // Mark Alert as Read
  markAlertAsRead(studentId, alertId) {
    try {
      const alerts = this.taskAlerts.get(studentId) || [];
      const alertIndex = alerts.findIndex(alert => alert.id === alertId);
      
      if (alertIndex === -1) {
        throw new Error('Alert not found');
      }

      alerts[alertIndex].status = 'read';
      alerts[alertIndex].readAt = new Date();

      logger.info('🔔 Task alert marked as read', { studentId, alertId });
      return alerts[alertIndex];
    } catch (error) {
      logger.error('❌ Error marking alert as read:', error);
      throw error;
    }
  }

  // Add Notebook Entry
  addNotebookEntry(studentId, entryData) {
    try {
      const {
        title,
        content,
        category,
        tags,
        isImportant,
        attachments
      } = entryData;

      if (!title || !content) {
        throw new Error('Title and content are required');
      }

      const entry = {
        id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        studentId,
        title,
        content,
        category: category || 'personal_notes',
        tags: tags || [],
        isImportant: isImportant || false,
        attachments: attachments || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: content.split(' ').length,
        characterCount: content.length
      };

      if (!this.studentNotebooks.has(studentId)) {
        this.studentNotebooks.set(studentId, []);
      }
      this.studentNotebooks.get(studentId).push(entry);

      logger.info('📝 Notebook entry added', { 
        studentId, 
        entryId: entry.id, 
        title, 
        category 
      });

      return entry;
    } catch (error) {
      logger.error('❌ Error adding notebook entry:', error);
      throw error;
    }
  }

  // Get Notebook Entries
  getNotebookEntries(studentId, filters = {}) {
    try {
      const entries = this.studentNotebooks.get(studentId) || [];
      let filteredEntries = entries;

      // Apply filters
      if (filters.category) {
        filteredEntries = filteredEntries.filter(entry => entry.category === filters.category);
      }
      if (filters.isImportant !== undefined) {
        filteredEntries = filteredEntries.filter(entry => entry.isImportant === filters.isImportant);
      }
      if (filters.tags && filters.tags.length > 0) {
        filteredEntries = filteredEntries.filter(entry => 
          filters.tags.some(tag => entry.tags.includes(tag))
        );
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredEntries = filteredEntries.filter(entry => 
          entry.title.toLowerCase().includes(searchTerm) || 
          entry.content.toLowerCase().includes(searchTerm)
        );
      }

      // Sort by creation date (newest first)
      filteredEntries.sort((a, b) => b.createdAt - a.createdAt);

      return {
        entries: filteredEntries,
        total: filteredEntries.length,
        categories: this.getNotebookCategories(),
        totalWords: filteredEntries.reduce((sum, entry) => sum + entry.wordCount, 0),
        totalCharacters: filteredEntries.reduce((sum, entry) => sum + entry.characterCount, 0)
      };
    } catch (error) {
      logger.error('❌ Error getting notebook entries:', error);
      throw error;
    }
  }

  // Update Notebook Entry
  updateNotebookEntry(studentId, entryId, updates) {
    try {
      const entries = this.studentNotebooks.get(studentId);
      if (!entries) {
        throw new Error('No notebook entries found for student');
      }

      const entryIndex = entries.findIndex(entry => entry.id === entryId);
      if (entryIndex === -1) {
        throw new Error('Notebook entry not found');
      }

      const entry = entries[entryIndex];
      const updatedEntry = { 
        ...entry, 
        ...updates, 
        updatedAt: new Date(),
        wordCount: updates.content ? updates.content.split(' ').length : entry.wordCount,
        characterCount: updates.content ? updates.content.length : entry.characterCount
      };

      entries[entryIndex] = updatedEntry;

      logger.info('📝 Notebook entry updated', { studentId, entryId, updates: Object.keys(updates) });
      return updatedEntry;
    } catch (error) {
      logger.error('❌ Error updating notebook entry:', error);
      throw error;
    }
  }

  // Delete Notebook Entry
  deleteNotebookEntry(studentId, entryId) {
    try {
      const entries = this.studentNotebooks.get(studentId);
      if (!entries) {
        throw new Error('No notebook entries found for student');
      }

      const entryIndex = entries.findIndex(entry => entry.id === entryId);
      if (entryIndex === -1) {
        throw new Error('Notebook entry not found');
      }

      const deletedEntry = entries.splice(entryIndex, 1)[0];

      logger.info('📝 Notebook entry deleted', { studentId, entryId, title: deletedEntry.title });
      return deletedEntry;
    } catch (error) {
      logger.error('❌ Error deleting notebook entry:', error);
      throw error;
    }
  }

  // Search Notebook Entries
  searchNotebookEntries(studentId, searchTerm) {
    try {
      const entries = this.studentNotebooks.get(studentId) || [];
      const term = searchTerm.toLowerCase();

      const searchResults = entries.filter(entry => 
        entry.title.toLowerCase().includes(term) ||
        entry.content.toLowerCase().includes(term) ||
        entry.tags.some(tag => tag.toLowerCase().includes(term))
      );

      return {
        searchTerm,
        results: searchResults,
        total: searchResults.length,
        categories: this.getNotebookCategories()
      };
    } catch (error) {
      logger.error('❌ Error searching notebook entries:', error);
      throw error;
    }
  }

  // Get Task Categories
  getTaskCategories() {
    return this.taskCategories;
  }

  // Get Notebook Categories
  getNotebookCategories() {
    return this.notebookCategories;
  }

  // Get Student Statistics
  getStudentStatistics(studentId) {
    try {
      const tasks = this.studentTasks.get(studentId) || [];
      const entries = this.studentNotebooks.get(studentId) || [];

      const taskStats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        overdue: tasks.filter(t => t.status === 'pending' && t.scheduledTime < new Date()).length,
        byCategory: {}
      };

      // Task statistics by category
      Object.keys(this.taskCategories).forEach(category => {
        taskStats.byCategory[category] = tasks.filter(t => t.category === category).length;
      });

      const notebookStats = {
        total: entries.length,
        totalWords: entries.reduce((sum, entry) => sum + entry.wordCount, 0),
        totalCharacters: entries.reduce((sum, entry) => sum + entry.characterCount, 0),
        important: entries.filter(e => e.isImportant).length,
        byCategory: {}
      };

      // Notebook statistics by category
      Object.keys(this.notebookCategories).forEach(category => {
        notebookStats.byCategory[category] = entries.filter(e => e.category === category).length;
      });

      return {
        studentId,
        tasks: taskStats,
        notebook: notebookStats,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('❌ Error getting student statistics:', error);
      throw error;
    }
  }

  // Enhanced Curriculum Functions

  // Get Curriculum Overview
  getCurriculumOverview(studentId) {
    try {
      const tasks = this.studentTasks.get(studentId) || [];
      const entries = this.studentNotebooks.get(studentId) || [];

      // Calculate progress by category
      const categoryProgress = {};
      Object.keys(this.taskCategories).forEach(category => {
        const categoryTasks = tasks.filter(t => t.category === category);
        const completed = categoryTasks.filter(t => t.status === 'completed').length;
        const total = categoryTasks.length;
        
        categoryProgress[category] = {
          name: this.taskCategories[category].name,
          icon: this.taskCategories[category].icon,
          color: this.taskCategories[category].color,
          completed,
          total,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
          subcategories: this.taskCategories[category].subcategories
        };
      });

      // Calculate overall progress
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Get recent activity
      const recentTasks = tasks
        .filter(t => t.status === 'completed')
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .slice(0, 5);

      const recentEntries = entries
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      return {
        studentId,
        overallProgress,
        totalTasks,
        completedTasks,
        categoryProgress,
        recentActivity: {
          tasks: recentTasks,
          notebookEntries: recentEntries
        },
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('❌ Error getting curriculum overview:', error);
      throw error;
    }
  }

  // Get Learning Path Recommendations
  getLearningPathRecommendations(studentId) {
    try {
      const tasks = this.studentTasks.get(studentId) || [];
      const overview = this.getCurriculumOverview(studentId);
      
      const recommendations = [];
      
      // Analyze weak areas (categories with low completion rates)
      Object.entries(overview.categoryProgress).forEach(([category, progress]) => {
        if (progress.percentage < 50 && progress.total > 0) {
          recommendations.push({
            type: 'focus_area',
            category,
            priority: 'high',
            message: `Focus on ${progress.name} - ${progress.completed}/${progress.total} tasks completed (${progress.percentage}%)`,
            suggestedActions: this.taskCategories[category].subcategories.slice(0, 3)
          });
        }
      });

      // Suggest next steps based on completed tasks
      const completedTasks = tasks.filter(t => t.status === 'completed');
      const lastCompleted = completedTasks
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];

      if (lastCompleted) {
        const category = lastCompleted.category;
        const subcategory = lastCompleted.subcategory;
        const categoryData = this.taskCategories[category];
        
        if (categoryData) {
          const nextSubcategories = categoryData.subcategories.filter(sub => sub !== subcategory);
          if (nextSubcategories.length > 0) {
            recommendations.push({
              type: 'next_step',
              category,
              priority: 'medium',
              message: `Continue with ${categoryData.name} - try ${nextSubcategories[0]}`,
              suggestedActions: nextSubcategories.slice(0, 2)
            });
          }
        }
      }

      // Suggest new categories to explore
      const unexploredCategories = Object.entries(this.taskCategories)
        .filter(([key, data]) => !tasks.some(t => t.category === key))
        .slice(0, 2);

      unexploredCategories.forEach(([key, data]) => {
        recommendations.push({
          type: 'explore_new',
          category: key,
          priority: 'low',
          message: `Explore ${data.name} - start with ${data.subcategories[0]}`,
          suggestedActions: data.subcategories.slice(0, 2)
        });
      });

      return {
        studentId,
        recommendations,
        total: recommendations.length,
        priorities: {
          high: recommendations.filter(r => r.priority === 'high').length,
          medium: recommendations.filter(r => r.priority === 'medium').length,
          low: recommendations.filter(r => r.priority === 'low').length
        },
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('❌ Error getting learning path recommendations:', error);
      throw error;
    }
  }

  // Get Study Schedule
  getStudySchedule(studentId, days = 7) {
    try {
      const tasks = this.studentTasks.get(studentId) || [];
      const today = new Date();
      const schedule = {};

      // Generate schedule for the next N days
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        
        schedule[dateKey] = {
          date: dateKey,
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          tasks: [],
          totalDuration: 0,
          categories: new Set()
        };
      }

      // Populate schedule with scheduled tasks
      tasks.forEach(task => {
        if (task.status === 'pending' && task.scheduledTime) {
          const taskDate = new Date(task.scheduledTime);
          const dateKey = taskDate.toISOString().split('T')[0];
          
          if (schedule[dateKey]) {
            schedule[dateKey].tasks.push({
              id: task.id,
              title: task.title,
              category: task.category,
              subcategory: task.subcategory,
              priority: task.priority,
              scheduledTime: task.scheduledTime,
              duration: task.duration || 60,
              location: task.location,
              notes: task.notes
            });
            
            schedule[dateKey].totalDuration += task.duration || 60;
            schedule[dateKey].categories.add(task.category);
          }
        }
      });

      // Convert categories Set to Array for JSON serialization
      Object.keys(schedule).forEach(dateKey => {
        schedule[dateKey].categories = Array.from(schedule[dateKey].categories);
      });

      // Calculate schedule statistics
      const totalScheduledTasks = Object.values(schedule)
        .reduce((sum, day) => sum + day.tasks.length, 0);
      const totalScheduledDuration = Object.values(schedule)
        .reduce((sum, day) => sum + day.totalDuration, 0);

      return {
        studentId,
        schedule,
        statistics: {
          totalDays: days,
          totalScheduledTasks,
          totalScheduledDuration,
          averageTasksPerDay: Math.round(totalScheduledTasks / days * 10) / 10,
          averageDurationPerDay: Math.round(totalScheduledDuration / days)
        },
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('❌ Error getting study schedule:', error);
      throw error;
    }
  }

  // Get Performance Analytics
  getPerformanceAnalytics(studentId, timeframe = 'month') {
    try {
      const tasks = this.studentTasks.get(studentId) || [];
      const today = new Date();
      let startDate;

      // Calculate start date based on timeframe
      switch (timeframe) {
        case 'week':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 1);
          break;
        case 'quarter':
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 3);
          break;
        case 'year':
          startDate = new Date(today);
          startDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 1);
      }

      // Filter tasks within timeframe
      const timeframeTasks = tasks.filter(task => {
        if (task.status === 'completed' && task.completedAt) {
          return new Date(task.completedAt) >= startDate;
        }
        return false;
      });

      // Calculate completion trends
      const dailyCompletions = {};
      timeframeTasks.forEach(task => {
        const dateKey = new Date(task.completedAt).toISOString().split('T')[0];
        dailyCompletions[dateKey] = (dailyCompletions[dateKey] || 0) + 1;
      });

      // Calculate category performance
      const categoryPerformance = {};
      Object.keys(this.taskCategories).forEach(category => {
        const categoryTasks = timeframeTasks.filter(t => t.category === category);
        const total = categoryTasks.length;
        
        if (total > 0) {
          const avgDuration = categoryTasks.reduce((sum, t) => sum + (t.duration || 60), 0) / total;
          const onTimeCompletions = categoryTasks.filter(t => {
            if (t.scheduledTime && t.completedAt) {
              return new Date(t.completedAt) <= new Date(t.scheduledTime);
            }
            return true;
          }).length;

          categoryPerformance[category] = {
            name: this.taskCategories[category].name,
            icon: this.taskCategories[category].icon,
            color: this.taskCategories[category].color,
            totalCompleted: total,
            averageDuration: Math.round(avgDuration),
            onTimeRate: Math.round((onTimeCompletions / total) * 100),
            efficiency: Math.round((total / avgDuration) * 100) / 100
          };
        }
      });

      // Calculate productivity metrics
      const totalCompleted = timeframeTasks.length;
      const totalScheduled = tasks.filter(t => 
        t.scheduledTime && new Date(t.scheduledTime) >= startDate
      ).length;
      const completionRate = totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;
      
      const totalDuration = timeframeTasks.reduce((sum, t) => sum + (t.duration || 60), 0);
      const averageTaskDuration = totalCompleted > 0 ? Math.round(totalDuration / totalCompleted) : 0;

      return {
        studentId,
        timeframe,
        period: {
          start: startDate,
          end: today,
          days: Math.ceil((today - startDate) / (1000 * 60 * 60 * 24))
        },
        metrics: {
          totalCompleted,
          totalScheduled,
          completionRate,
          totalDuration,
          averageTaskDuration,
          averageTasksPerDay: Math.round((totalCompleted / (timeframe === 'week' ? 7 : 30)) * 10) / 10
        },
        trends: {
          dailyCompletions,
          categoryPerformance
        },
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('❌ Error getting performance analytics:', error);
      throw error;
    }
  }

  // Get Curriculum Milestones
  getCurriculumMilestones(studentId) {
    try {
      const tasks = this.studentTasks.get(studentId) || [];
      const completedTasks = tasks.filter(t => t.status === 'completed');
      
      // Define milestone thresholds
      const milestones = [
        { id: 'first_task', name: 'First Task Completed', requirement: 1, icon: '🎯', color: 'green' },
        { id: 'task_master', name: 'Task Master', requirement: 10, icon: '⭐', color: 'blue' },
        { id: 'dedicated_student', name: 'Dedicated Student', requirement: 25, icon: '🏆', color: 'purple' },
        { id: 'expert_learner', name: 'Expert Learner', requirement: 50, icon: '👑', color: 'gold' },
        { id: 'legendary_student', name: 'Legendary Student', requirement: 100, icon: '🌟', color: 'orange' }
      ];

      // Calculate category-specific milestones
      const categoryMilestones = {};
      Object.keys(this.taskCategories).forEach(category => {
        const categoryCompleted = completedTasks.filter(t => t.category === category).length;
        const categoryData = this.taskCategories[category];
        
        categoryMilestones[category] = {
          name: categoryData.name,
          icon: categoryData.icon,
          color: categoryData.color,
          completed: categoryCompleted,
          milestones: [
            { name: `${categoryData.name} Beginner`, requirement: 1, achieved: categoryCompleted >= 1 },
            { name: `${categoryData.name} Intermediate`, requirement: 5, achieved: categoryCompleted >= 5 },
            { name: `${categoryData.name} Advanced`, requirement: 15, achieved: categoryCompleted >= 15 },
            { name: `${categoryData.name} Expert`, requirement: 30, achieved: categoryCompleted >= 30 }
          ]
        };
      });

      // Calculate overall progress
      const totalCompleted = completedTasks.length;
      const achievedMilestones = milestones.filter(m => totalCompleted >= m.requirement);
      const nextMilestone = milestones.find(m => totalCompleted < m.requirement);

      // Calculate streak information
      const sortedCompleted = completedTasks
        .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
      
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      for (let i = 0; i < sortedCompleted.length; i++) {
        const currentDate = new Date(sortedCompleted[i].completedAt);
        const nextDate = i < sortedCompleted.length - 1 ? 
          new Date(sortedCompleted[i + 1].completedAt) : null;
        
        if (nextDate) {
          const dayDiff = Math.ceil((nextDate - currentDate) / (1000 * 60 * 60 * 24));
          if (dayDiff === 1) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 0;
          }
        }
      }
      
      currentStreak = tempStreak;

      return {
        studentId,
        overall: {
          totalCompleted,
          achievedMilestones,
          nextMilestone,
          currentStreak,
          longestStreak
        },
        categoryMilestones,
        achievements: {
          total: achievedMilestones.length,
          recent: achievedMilestones.slice(-3),
          upcoming: nextMilestone ? [nextMilestone] : []
        },
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('❌ Error getting curriculum milestones:', error);
      throw error;
    }
  }

  // Get Adaptive Learning Suggestions
  getAdaptiveLearningSuggestions(studentId) {
    try {
      const tasks = this.studentTasks.get(studentId) || [];
      const analytics = this.getPerformanceAnalytics(studentId, 'month');
      const milestones = this.getCurriculumMilestones(studentId);
      
      const suggestions = [];
      
      // Performance-based suggestions
      if (analytics.metrics.completionRate < 70) {
        suggestions.push({
          type: 'performance_improvement',
          priority: 'high',
          title: 'Improve Task Completion Rate',
          message: `Your completion rate is ${analytics.metrics.completionRate}%. Focus on completing scheduled tasks on time.`,
          actions: [
            'Review your daily schedule',
            'Set realistic task durations',
            'Use task alerts and reminders',
            'Break large tasks into smaller ones'
          ]
        });
      }

      // Streak-based suggestions
      if (milestones.overall.currentStreak < 3) {
        suggestions.push({
          type: 'consistency_improvement',
          priority: 'medium',
          title: 'Build Consistent Learning Habits',
          message: `Maintain a daily learning streak. Your current streak is ${milestones.overall.currentStreak} days.`,
          actions: [
            'Complete at least one task daily',
            'Set aside dedicated study time',
            'Use the study schedule feature',
            'Track your progress regularly'
          ]
        });
      }

      // Category balance suggestions
      const categoryCounts = {};
      Object.keys(analytics.trends.categoryPerformance).forEach(category => {
        categoryCounts[category] = analytics.trends.categoryPerformance[category].totalCompleted;
      });

      const totalCategoryTasks = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
      const averagePerCategory = totalCategoryTasks / Object.keys(categoryCounts).length;

      Object.entries(categoryCounts).forEach(([category, count]) => {
        if (count < averagePerCategory * 0.5) {
          const categoryData = this.taskCategories[category];
          suggestions.push({
            type: 'category_balance',
            priority: 'medium',
            title: `Explore ${categoryData.name}`,
            message: `You've completed fewer ${categoryData.name} tasks. Consider diversifying your learning.`,
            actions: [
              `Try a ${categoryData.subcategories[0]} task`,
              `Schedule regular ${categoryData.name} sessions`,
              `Review ${categoryData.name} materials`
            ]
          });
        }
      });

      // Efficiency suggestions
      const avgDuration = analytics.metrics.averageTaskDuration;
      if (avgDuration > 120) {
        suggestions.push({
          type: 'efficiency_improvement',
          priority: 'low',
          title: 'Optimize Task Duration',
          message: `Your average task duration is ${avgDuration} minutes. Consider time management strategies.`,
          actions: [
            'Use the Pomodoro technique',
            'Set time limits for tasks',
            'Review task complexity',
            'Practice focused study sessions'
          ]
        });
      }

      return {
        studentId,
        suggestions,
        total: suggestions.length,
        priorities: {
          high: suggestions.filter(s => s.priority === 'high').length,
          medium: suggestions.filter(s => s.priority === 'medium').length,
          low: suggestions.filter(s => s.priority === 'low').length
        },
        categories: {
          performance: suggestions.filter(s => s.type === 'performance_improvement').length,
          consistency: suggestions.filter(s => s.type === 'consistency_improvement').length,
          balance: suggestions.filter(s => s.type === 'category_balance').length,
          efficiency: suggestions.filter(s => s.type === 'efficiency_improvement').length
        },
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('❌ Error getting adaptive learning suggestions:', error);
      throw error;
    }
  }
}

module.exports = new StudentTaskManager(); 