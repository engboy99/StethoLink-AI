const { logger } = require('../utils/logger');
const { getDb, getUser, updateUser } = require('../config/firebase');
const chatMemoryService = require('./chat-memory-service');
const studentTaskManager = require('./student-task-manager');

class UserProfileService {
  constructor() {
    this.db = getDb();
    this.collections = {
      USERS: 'users',
      USER_PROFILES: 'user_profiles',
      USER_STATS: 'user_stats',
      USER_ACHIEVEMENTS: 'user_achievements',
      USER_GOALS: 'user_goals',
      USER_NOTES: 'user_notes'
    };
  }

  // Get comprehensive user profile
  async getUserProfile(userId) {
    try {
      // Get basic user data
      const user = await getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get additional profile data
      const [profile, stats, achievements, goals, chatMemory, preferences] = await Promise.all([
        this.getExtendedProfile(userId),
        this.getUserStats(userId),
        this.getUserAchievements(userId),
        this.getUserGoals(userId),
        chatMemoryService.getChatMemory(userId),
        chatMemoryService.getUserPreferences(userId)
      ]);

      // Get curriculum overview
      const curriculumOverview = await studentTaskManager.getCurriculumOverview(userId);

      const comprehensiveProfile = {
        basic: {
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
          language: user.language || 'en',
          platform: user.platform || 'api',
          createdAt: user.createdAt,
          lastActive: user.stats?.lastActive || user.createdAt
        },
        extended: profile,
        stats: stats,
        achievements: achievements,
        goals: goals,
        chatMemory: chatMemory,
        preferences: preferences,
        curriculum: curriculumOverview,
        lastUpdated: new Date()
      };

      logger.info('👤 Comprehensive user profile retrieved', { userId });

      return comprehensiveProfile;
    } catch (error) {
      logger.error('❌ Error getting user profile:', error);
      throw error;
    }
  }

  // Get extended profile information
  async getExtendedProfile(userId) {
    try {
      const profileRef = this.db.collection(this.collections.USER_PROFILES).doc(userId);
      const profileDoc = await profileRef.get();

      if (!profileDoc.exists) {
        // Create default extended profile
        const defaultProfile = {
          userId,
          personalInfo: {
            firstName: '',
            lastName: '',
            dateOfBirth: null,
            gender: '',
            location: '',
            timezone: 'UTC'
          },
          medicalInfo: {
            specialization: '',
            experienceLevel: 'student',
            currentInstitution: '',
            graduationYear: null,
            certifications: []
          },
          learningProfile: {
            preferredSubjects: [],
            learningGoals: [],
            studyHabits: [],
            preferredLearningTime: 'morning',
            studySessionDuration: 60
          },
          communication: {
            preferredLanguage: 'en',
            notificationPreferences: {
              email: true,
              push: true,
              sms: false,
              whatsapp: false,
              telegram: false
            },
            privacySettings: {
              shareProgress: false,
              publicProfile: false,
              dataCollection: true
            }
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await profileRef.set(defaultProfile);
        return defaultProfile;
      }

      return {
        id: profileDoc.id,
        ...profileDoc.data()
      };
    } catch (error) {
      logger.error('❌ Error getting extended profile:', error);
      throw error;
    }
  }

  // Update extended profile
  async updateExtendedProfile(userId, updates) {
    try {
      const profileRef = this.db.collection(this.collections.USER_PROFILES).doc(userId);
      
      await profileRef.update({
        ...updates,
        updatedAt: new Date()
      });

      logger.info('👤 Extended profile updated', { userId, updates });
    } catch (error) {
      logger.error('❌ Error updating extended profile:', error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(userId) {
    try {
      const statsRef = this.db.collection(this.collections.USER_STATS).doc(userId);
      const statsDoc = await statsRef.get();

      if (!statsDoc.exists) {
        // Initialize default stats
        const defaultStats = {
          userId,
          activity: {
            totalSessions: 0,
            totalTimeSpent: 0,
            lastSession: null,
            averageSessionDuration: 0,
            longestStreak: 0,
            currentStreak: 0
          },
          learning: {
            totalTopics: 0,
            completedTopics: 0,
            totalTasks: 0,
            completedTasks: 0,
            averageScore: 0,
            improvementRate: 0
          },
          engagement: {
            totalMessages: 0,
            totalResponses: 0,
            averageResponseTime: 0,
            platformUsage: {},
            featureUsage: {}
          },
          performance: {
            accuracy: 0,
            speed: 0,
            consistency: 0,
            adaptability: 0
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await statsRef.set(defaultStats);
        return defaultStats;
      }

      return {
        id: statsDoc.id,
        ...statsDoc.data()
      };
    } catch (error) {
      logger.error('❌ Error getting user stats:', error);
      throw error;
    }
  }

  // Update user statistics
  async updateUserStats(userId, updates) {
    try {
      const statsRef = this.db.collection(this.collections.USER_STATS).doc(userId);
      
      await statsRef.update({
        ...updates,
        updatedAt: new Date()
      });

      logger.info('📊 User stats updated', { userId, updates });
    } catch (error) {
      logger.error('❌ Error updating user stats:', error);
      throw error;
    }
  }

  // Get user achievements
  async getUserAchievements(userId) {
    try {
      const achievementsRef = this.db.collection(this.collections.USER_ACHIEVEMENTS).doc(userId);
      const achievementsDoc = await achievementsRef.get();

      if (!achievementsDoc.exists) {
        // Initialize default achievements
        const defaultAchievements = {
          userId,
          achievements: [],
          badges: [],
          milestones: [],
          totalPoints: 0,
          level: 1,
          rank: 'Beginner',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await achievementsRef.set(defaultAchievements);
        return defaultAchievements;
      }

      return {
        id: achievementsDoc.id,
        ...achievementsDoc.data()
      };
    } catch (error) {
      logger.error('❌ Error getting user achievements:', error);
      throw error;
    }
  }

  // Add achievement to user
  async addAchievement(userId, achievement) {
    try {
      const achievementsRef = this.db.collection(this.collections.USER_ACHIEVEMENTS).doc(userId);
      const achievementsDoc = await achievementsRef.get();

      if (!achievementsDoc.exists) {
        // Initialize achievements first
        await this.getUserAchievements(userId);
      }

      const newAchievement = {
        ...achievement,
        earnedAt: new Date(),
        id: `${achievement.type}_${Date.now()}`
      };

      await achievementsRef.update({
        achievements: admin.firestore.FieldValue.arrayUnion(newAchievement),
        totalPoints: admin.firestore.FieldValue.increment(achievement.points || 0),
        updatedAt: new Date()
      });

      // Check for level up
      await this.checkLevelUp(userId);

      logger.info('🏆 Achievement added', { userId, achievement: newAchievement });
    } catch (error) {
      logger.error('❌ Error adding achievement:', error);
      throw error;
    }
  }

  // Check and update user level
  async checkLevelUp(userId) {
    try {
      const achievements = await this.getUserAchievements(userId);
      const totalPoints = achievements.totalPoints;
      
      let newLevel = 1;
      let newRank = 'Beginner';

      // Level calculation based on points
      if (totalPoints >= 1000) {
        newLevel = Math.floor(totalPoints / 1000) + 1;
      }

      // Rank calculation
      if (newLevel >= 10) newRank = 'Expert';
      else if (newLevel >= 5) newRank = 'Advanced';
      else if (newLevel >= 2) newRank = 'Intermediate';

      // Update if level changed
      if (newLevel !== achievements.level || newRank !== achievements.rank) {
        const achievementsRef = this.db.collection(this.collections.USER_ACHIEVEMENTS).doc(userId);
        await achievementsRef.update({
          level: newLevel,
          rank: newRank,
          updatedAt: new Date()
        });

        logger.info('🎯 User leveled up', { userId, oldLevel: achievements.level, newLevel, newRank });
      }
    } catch (error) {
      logger.error('❌ Error checking level up:', error);
    }
  }

  // Get user goals
  async getUserGoals(userId) {
    try {
      const goalsRef = this.db.collection(this.collections.USER_GOALS).doc(userId);
      const goalsDoc = await goalsRef.get();

      if (!goalsDoc.exists) {
        // Initialize default goals
        const defaultGoals = {
          userId,
          shortTerm: [],
          longTerm: [],
          completed: [],
          progress: {
            shortTermProgress: 0,
            longTermProgress: 0,
            overallProgress: 0
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await goalsRef.set(defaultGoals);
        return defaultGoals;
      }

      return {
        id: goalsDoc.id,
        ...goalsDoc.data()
      };
    } catch (error) {
      logger.error('❌ Error getting user goals:', error);
      throw error;
    }
  }

  // Add user goal
  async addUserGoal(userId, goal) {
    try {
      const goalsRef = this.db.collection(this.collections.USER_GOALS).doc(userId);
      const goalsDoc = await goalsRef.get();

      if (!goalsDoc.exists) {
        // Initialize goals first
        await this.getUserGoals(userId);
      }

      const newGoal = {
        ...goal,
        id: `goal_${Date.now()}`,
        createdAt: new Date(),
        status: 'active',
        progress: 0
      };

      const goalType = goal.type === 'long' ? 'longTerm' : 'shortTerm';
      
      await goalsRef.update({
        [goalType]: admin.firestore.FieldValue.arrayUnion(newGoal),
        updatedAt: new Date()
      });

      logger.info('🎯 User goal added', { userId, goal: newGoal });
    } catch (error) {
      logger.error('❌ Error adding user goal:', error);
      throw error;
    }
  }

  // Update goal progress
  async updateGoalProgress(userId, goalId, progress) {
    try {
      const goals = await this.getUserGoals(userId);
      const goalsRef = this.db.collection(this.collections.USER_GOALS).doc(userId);

      // Find and update goal in appropriate array
      let updated = false;
      const updateArrays = ['shortTerm', 'longTerm'];

      for (const arrayName of updateArrays) {
        const array = goals[arrayName];
        const goalIndex = array.findIndex(g => g.id === goalId);
        
        if (goalIndex !== -1) {
          array[goalIndex].progress = progress;
          array[goalIndex].updatedAt = new Date();
          
          // Check if goal is completed
          if (progress >= 100 && array[goalIndex].status !== 'completed') {
            array[goalIndex].status = 'completed';
            array[goalIndex].completedAt = new Date();
            
            // Move to completed array
            await goalsRef.update({
              completed: admin.firestore.FieldValue.arrayUnion(array[goalIndex]),
              [arrayName]: admin.firestore.FieldValue.arrayRemove(array[goalIndex]),
              updatedAt: new Date()
            });
          } else {
            // Update progress in place
            await goalsRef.update({
              [arrayName]: array,
              updatedAt: new Date()
            });
          }
          
          updated = true;
          break;
        }
      }

      if (updated) {
        // Recalculate overall progress
        await this.recalculateGoalProgress(userId);
        logger.info('🎯 Goal progress updated', { userId, goalId, progress });
      }
    } catch (error) {
      logger.error('❌ Error updating goal progress:', error);
      throw error;
    }
  }

  // Recalculate overall goal progress
  async recalculateGoalProgress(userId) {
    try {
      const goals = await this.getUserGoals(userId);
      const goalsRef = this.db.collection(this.collections.USER_GOALS).doc(userId);

      const shortTermProgress = goals.shortTerm.length > 0 
        ? goals.shortTerm.reduce((sum, goal) => sum + goal.progress, 0) / goals.shortTerm.length 
        : 0;

      const longTermProgress = goals.longTerm.length > 0 
        ? goals.longTerm.reduce((sum, goal) => sum + goal.progress, 0) / goals.longTerm.length 
        : 0;

      const overallProgress = goals.shortTerm.length + goals.longTerm.length > 0
        ? (shortTermProgress + longTermProgress) / 2
        : 0;

      await goalsRef.update({
        'progress.shortTermProgress': Math.round(shortTermProgress),
        'progress.longTermProgress': Math.round(longTermProgress),
        'progress.overallProgress': Math.round(overallProgress),
        updatedAt: new Date()
      });

      logger.info('📊 Goal progress recalculated', { userId, shortTermProgress, longTermProgress, overallProgress });
    } catch (error) {
      logger.error('❌ Error recalculating goal progress:', error);
    }
  }

  // Get user notes
  async getUserNotes(userId) {
    try {
      const notesRef = this.db.collection(this.collections.USER_NOTES).doc(userId);
      const notesDoc = await notesRef.get();

      if (!notesDoc.exists) {
        // Initialize default notes
        const defaultNotes = {
          userId,
          notes: [],
          categories: [],
          totalNotes: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await notesRef.set(defaultNotes);
        return defaultNotes;
      }

      return {
        id: notesDoc.id,
        ...notesDoc.data()
      };
    } catch (error) {
      logger.error('❌ Error getting user notes:', error);
      throw error;
    }
  }

  // Add user note
  async addUserNote(userId, note) {
    try {
      const notesRef = this.db.collection(this.collections.USER_NOTES).doc(userId);
      const notesDoc = await notesRef.get();

      if (!notesDoc.exists) {
        // Initialize notes first
        await this.getUserNotes(userId);
      }

      const newNote = {
        ...note,
        id: `note_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await notesRef.update({
        notes: admin.firestore.FieldValue.arrayUnion(newNote),
        totalNotes: admin.firestore.FieldValue.increment(1),
        updatedAt: new Date()
      });

      logger.info('📝 User note added', { userId, note: newNote });
    } catch (error) {
      logger.error('❌ Error adding user note:', error);
      throw error;
    }
  }

  // Get user dashboard data
  async getUserDashboard(userId) {
    try {
      const [
        profile,
        stats,
        achievements,
        goals,
        chatMemory,
        curriculumOverview,
        conversationSummary
      ] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserStats(userId),
        this.getUserAchievements(userId),
        this.getUserGoals(userId),
        chatMemoryService.getChatMemory(userId),
        studentTaskManager.getCurriculumOverview(userId),
        chatMemoryService.getConversationSummary(userId, 'week')
      ]);

      const dashboard = {
        user: profile.basic,
        overview: {
          level: achievements.level,
          rank: achievements.rank,
          totalPoints: achievements.totalPoints,
          overallProgress: curriculumOverview.overallProgress,
          currentStreak: stats.activity.currentStreak,
          longestStreak: stats.activity.longestStreak
        },
        recentActivity: {
          lastSession: stats.activity.lastSession,
          totalSessions: stats.activity.totalSessions,
          totalTasks: curriculumOverview.totalTasks,
          completedTasks: curriculumOverview.completedTasks
        },
        goals: {
          shortTerm: goals.shortTerm.filter(g => g.status === 'active'),
          longTerm: goals.longTerm.filter(g => g.status === 'active'),
          progress: goals.progress
        },
        achievements: {
          recent: achievements.achievements.slice(-3),
          total: achievements.achievements.length
        },
        chat: {
          totalMessages: chatMemory.messageCount,
          lastInteraction: chatMemory.lastInteraction,
          conversationSummary
        },
        curriculum: {
          categoryProgress: curriculumOverview.categoryProgress,
          recentActivity: curriculumOverview.recentActivity
        },
        lastUpdated: new Date()
      };

      logger.info('📊 User dashboard generated', { userId });

      return dashboard;
    } catch (error) {
      logger.error('❌ Error getting user dashboard:', error);
      throw error;
    }
  }

  // Update user activity
  async updateUserActivity(userId, activityData) {
    try {
      const {
        sessionDuration = 0,
        platform = 'api',
        features = [],
        actions = []
      } = activityData;

      // Update basic user stats
      await updateUser(userId, {
        'stats.lastActive': new Date(),
        'stats.lastSession': new Date()
      });

      // Update detailed stats
      const stats = await this.getUserStats(userId);
      const updatedStats = {
        'activity.totalSessions': stats.activity.totalSessions + 1,
        'activity.totalTimeSpent': stats.activity.totalTimeSpent + sessionDuration,
        'activity.lastSession': new Date(),
        'activity.averageSessionDuration': Math.round(
          (stats.activity.totalTimeSpent + sessionDuration) / (stats.activity.totalSessions + 1)
        )
      };

      // Update platform usage
      if (platform) {
        updatedStats[`engagement.platformUsage.${platform}`] = 
          (stats.engagement.platformUsage[platform] || 0) + 1;
      }

      // Update feature usage
      features.forEach(feature => {
        updatedStats[`engagement.featureUsage.${feature}`] = 
          (stats.engagement.featureUsage[feature] || 0) + 1;
      });

      await this.updateUserStats(userId, updatedStats);

      logger.info('📊 User activity updated', { userId, activityData });
    } catch (error) {
      logger.error('❌ Error updating user activity:', error);
      throw error;
    }
  }

  // Get user recommendations
  async getUserRecommendations(userId) {
    try {
      const [profile, stats, achievements, goals, chatMemory] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserStats(userId),
        this.getUserAchievements(userId),
        this.getUserGoals(userId),
        chatMemoryService.getChatMemory(userId)
      ]);

      const recommendations = [];

      // Learning recommendations based on progress
      if (stats.learning.averageScore < 70) {
        recommendations.push({
          type: 'learning_improvement',
          priority: 'high',
          title: 'Improve Learning Performance',
          message: 'Your average score is below 70%. Focus on understanding core concepts.',
          actions: [
            'Review completed topics',
            'Practice with simulations',
            'Ask for clarification on difficult concepts'
          ]
        });
      }

      // Goal recommendations
      if (goals.shortTerm.length < 2) {
        recommendations.push({
          type: 'goal_setting',
          priority: 'medium',
          title: 'Set More Short-term Goals',
          message: 'Setting specific short-term goals can help maintain motivation.',
          actions: [
            'Set weekly study targets',
            'Create specific learning milestones',
            'Track progress regularly'
          ]
        });
      }

      // Engagement recommendations
      if (stats.activity.currentStreak < 3) {
        recommendations.push({
          type: 'consistency',
          priority: 'medium',
          title: 'Build Consistent Study Habits',
          message: 'Maintaining a daily study streak can improve long-term retention.',
          actions: [
            'Study for at least 30 minutes daily',
            'Use the reminder system',
            'Set consistent study times'
          ]
        });
      }

      // Feature recommendations
      const unusedFeatures = ['simulations', 'notebook', 'tasks', 'reminders'].filter(
        feature => !stats.engagement.featureUsage[feature] || stats.engagement.featureUsage[feature] < 3
      );

      if (unusedFeatures.length > 0) {
        recommendations.push({
          type: 'feature_exploration',
          priority: 'low',
          title: 'Explore More Features',
          message: `Try using ${unusedFeatures.slice(0, 2).join(' and ')} to enhance your learning experience.`,
          actions: unusedFeatures.slice(0, 2).map(feature => `Use ${feature} feature`)
        });
      }

      return {
        userId,
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
      logger.error('❌ Error getting user recommendations:', error);
      throw error;
    }
  }
}

module.exports = new UserProfileService(); 