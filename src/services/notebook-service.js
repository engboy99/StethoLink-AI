const { logger } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

class NotebookService {
    constructor() {
        this.studentNotebooks = new Map();
        this.categories = [
            'anatomy', 'physiology', 'biochemistry', 'pathology', 'pharmacology',
            'microbiology', 'clinical', 'surgery', 'medicine', 'pediatrics',
            'obstetrics', 'psychiatry', 'emergency', 'radiology', 'laboratory',
            'research', 'exam_notes', 'case_studies', 'procedures', 'drugs',
            'calculations', 'guidelines', 'personal', 'other'
        ];
    }

    // Add a new note
    async addNote(studentId, noteData) {
        try {
            const noteId = uuidv4();
            const now = new Date();

            const note = {
                id: noteId,
                studentId: studentId,
                title: noteData.title || 'Untitled Note',
                content: noteData.content || '',
                category: noteData.category || 'other',
                tags: noteData.tags || [],
                priority: noteData.priority || 'medium',
                status: 'active',
                createdAt: now,
                updatedAt: now,
                wordCount: this.calculateWordCount(noteData.content || ''),
                attachments: noteData.attachments || [],
                isPublic: noteData.isPublic || false,
                sharedWith: noteData.sharedWith || []
            };

            // Get or create student's notebook
            let notebook = this.studentNotebooks.get(studentId);
            if (!notebook) {
                notebook = {
                    studentId: studentId,
                    notes: [],
                    categories: this.categories,
                    createdAt: now,
                    updatedAt: now
                };
                this.studentNotebooks.set(studentId, notebook);
            }

            // Add note to notebook
            notebook.notes.push(note);
            notebook.updatedAt = now;
            this.studentNotebooks.set(studentId, notebook);

            logger.info(`📝 Note added successfully: ${note.title}`, { 
                noteId, 
                studentId, 
                category: note.category,
                wordCount: note.wordCount 
            });

            return {
                success: true,
                note: note,
                message: `Note "${note.title}" added successfully!`
            };
        } catch (error) {
            logger.error('❌ Error adding note:', error);
            throw error;
        }
    }

    // Get all notes for a student
    async getNotes(studentId, filters = {}) {
        try {
            const notebook = this.studentNotebooks.get(studentId);
            if (!notebook) {
                return {
                    success: true,
                    notes: [],
                    total: 0,
                    message: 'No notes found. Start by adding your first note!'
                };
            }

            let notes = [...notebook.notes];

            // Apply filters
            if (filters.category) {
                notes = notes.filter(note => note.category === filters.category);
            }

            if (filters.status) {
                notes = notes.filter(note => note.status === filters.status);
            }

            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                notes = notes.filter(note => 
                    note.title.toLowerCase().includes(searchTerm) ||
                    note.content.toLowerCase().includes(searchTerm) ||
                    note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
                );
            }

            if (filters.priority) {
                notes = notes.filter(note => note.priority === filters.priority);
            }

            // Sort notes
            const sortBy = filters.sortBy || 'updatedAt';
            const sortOrder = filters.sortOrder || 'desc';
            
            notes.sort((a, b) => {
                if (sortOrder === 'asc') {
                    return a[sortBy] > b[sortBy] ? 1 : -1;
                } else {
                    return a[sortBy] < b[sortBy] ? 1 : -1;
                }
            });

            // Pagination
            const page = filters.page || 1;
            const limit = filters.limit || 20;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedNotes = notes.slice(startIndex, endIndex);

            return {
                success: true,
                notes: paginatedNotes,
                total: notes.length,
                page: page,
                totalPages: Math.ceil(notes.length / limit),
                message: `Found ${notes.length} notes`
            };
        } catch (error) {
            logger.error('❌ Error getting notes:', error);
            throw error;
        }
    }

    // Get a specific note
    async getNote(studentId, noteId) {
        try {
            const notebook = this.studentNotebooks.get(studentId);
            if (!notebook) {
                return {
                    success: false,
                    message: 'Notebook not found'
                };
            }

            const note = notebook.notes.find(n => n.id === noteId);
            if (!note) {
                return {
                    success: false,
                    message: 'Note not found'
                };
            }

            return {
                success: true,
                note: note,
                message: 'Note retrieved successfully'
            };
        } catch (error) {
            logger.error('❌ Error getting note:', error);
            throw error;
        }
    }

    // Update a note
    async updateNote(studentId, noteId, updateData) {
        try {
            const notebook = this.studentNotebooks.get(studentId);
            if (!notebook) {
                return {
                    success: false,
                    message: 'Notebook not found'
                };
            }

            const noteIndex = notebook.notes.findIndex(n => n.id === noteId);
            if (noteIndex === -1) {
                return {
                    success: false,
                    message: 'Note not found'
                };
            }

            const note = notebook.notes[noteIndex];
            const updatedNote = {
                ...note,
                ...updateData,
                updatedAt: new Date(),
                wordCount: this.calculateWordCount(updateData.content || note.content)
            };

            notebook.notes[noteIndex] = updatedNote;
            notebook.updatedAt = new Date();
            this.studentNotebooks.set(studentId, notebook);

            logger.info(`📝 Note updated successfully: ${updatedNote.title}`, { 
                noteId, 
                studentId 
            });

            return {
                success: true,
                note: updatedNote,
                message: `Note "${updatedNote.title}" updated successfully!`
            };
        } catch (error) {
            logger.error('❌ Error updating note:', error);
            throw error;
        }
    }

    // Delete a note
    async deleteNote(studentId, noteId) {
        try {
            const notebook = this.studentNotebooks.get(studentId);
            if (!notebook) {
                return {
                    success: false,
                    message: 'Notebook not found'
                };
            }

            const noteIndex = notebook.notes.findIndex(n => n.id === noteId);
            if (noteIndex === -1) {
                return {
                    success: false,
                    message: 'Note not found'
                };
            }

            const deletedNote = notebook.notes[noteIndex];
            notebook.notes.splice(noteIndex, 1);
            notebook.updatedAt = new Date();
            this.studentNotebooks.set(studentId, notebook);

            logger.info(`🗑️ Note deleted successfully: ${deletedNote.title}`, { 
                noteId, 
                studentId 
            });

            return {
                success: true,
                message: `Note "${deletedNote.title}" deleted successfully!`
            };
        } catch (error) {
            logger.error('❌ Error deleting note:', error);
            throw error;
        }
    }

    // Search notes
    async searchNotes(studentId, searchTerm, options = {}) {
        try {
            const result = await this.getNotes(studentId, {
                search: searchTerm,
                ...options
            });

            return {
                ...result,
                searchTerm: searchTerm,
                message: `Search results for "${searchTerm}": ${result.total} notes found`
            };
        } catch (error) {
            logger.error('❌ Error searching notes:', error);
            throw error;
        }
    }

    // Get note statistics
    async getNoteStats(studentId) {
        try {
            const notebook = this.studentNotebooks.get(studentId);
            if (!notebook) {
                return {
                    success: true,
                    stats: {
                        totalNotes: 0,
                        totalWords: 0,
                        categories: {},
                        recentActivity: [],
                        topTags: []
                    }
                };
            }

            const notes = notebook.notes;
            const totalNotes = notes.length;
            const totalWords = notes.reduce((sum, note) => sum + note.wordCount, 0);

            // Category statistics
            const categories = {};
            notes.forEach(note => {
                categories[note.category] = (categories[note.category] || 0) + 1;
            });

            // Recent activity (last 10 notes)
            const recentActivity = notes
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .slice(0, 10)
                .map(note => ({
                    id: note.id,
                    title: note.title,
                    category: note.category,
                    updatedAt: note.updatedAt
                }));

            // Top tags
            const tagCounts = {};
            notes.forEach(note => {
                note.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            });

            const topTags = Object.entries(tagCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([tag, count]) => ({ tag, count }));

            return {
                success: true,
                stats: {
                    totalNotes,
                    totalWords,
                    categories,
                    recentActivity,
                    topTags
                }
            };
        } catch (error) {
            logger.error('❌ Error getting note stats:', error);
            throw error;
        }
    }

    // Get available categories
    async getCategories() {
        return {
            success: true,
            categories: this.categories,
            message: 'Categories retrieved successfully'
        };
    }

    // Add a new category
    async addCategory(studentId, categoryName) {
        try {
            if (this.categories.includes(categoryName)) {
                return {
                    success: false,
                    message: 'Category already exists'
                };
            }

            this.categories.push(categoryName);

            logger.info(`📂 Category added: ${categoryName}`, { studentId });

            return {
                success: true,
                category: categoryName,
                message: `Category "${categoryName}" added successfully!`
            };
        } catch (error) {
            logger.error('❌ Error adding category:', error);
            throw error;
        }
    }

    // Calculate word count
    calculateWordCount(content) {
        if (!content) return 0;
        return content.trim().split(/\s+/).length;
    }

    // Export notes (for backup or sharing)
    async exportNotes(studentId, format = 'json') {
        try {
            const notebook = this.studentNotebooks.get(studentId);
            if (!notebook) {
                return {
                    success: false,
                    message: 'No notes to export'
                };
            }

            const exportData = {
                studentId: studentId,
                exportedAt: new Date(),
                totalNotes: notebook.notes.length,
                notes: notebook.notes
            };

            return {
                success: true,
                data: exportData,
                format: format,
                message: `Exported ${notebook.notes.length} notes successfully!`
            };
        } catch (error) {
            logger.error('❌ Error exporting notes:', error);
            throw error;
        }
    }
}

module.exports = new NotebookService(); 