import React, { useState } from 'react';
import { SubjectOption } from '../constants/initialData';
import {
  BookOpen,
  Search,
  X,
  Check,
  Sparkles,
  Plus,
  Trash2,
  RotateCcw,
} from 'lucide-react';

interface SubjectPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectOption[];
  onSelectSubject: (subject: SubjectOption, experimentTitle?: string) => void;
  onAddSubject: (subject: SubjectOption) => void;
  onDeleteSubject: (code: string) => void;
  onResetSubjects: () => void;
  currentCourseCode?: string;
}

export const SubjectPickerModal: React.FC<SubjectPickerModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onSelectSubject,
  onAddSubject,
  onDeleteSubject,
  onResetSubjects,
  currentCourseCode,
}) => {
  const [activeTab, setActiveTab] = useState<'EEE' | 'ALL'>('EEE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectForExp, setSelectedSubjectForExp] = useState<SubjectOption | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [confirmDeleteCode, setConfirmDeleteCode] = useState<string | null>(null);

  // New subject form states
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDepartment, setNewDepartment] = useState('Department of Electrical & Electronic Engineering');
  const [newProgram, setNewProgram] = useState('B.Sc. in EEE');
  const [newExperiments, setNewExperiments] = useState('');

  if (!isOpen) return null;

  const subjectList =
    activeTab === 'EEE'
      ? subjects.filter((s) => s.code.startsWith('EEE') || s.department.includes('Electrical'))
      : subjects;

  const filtered = subjectList.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      s.code.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  });

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newTitle.trim()) {
      return;
    }

    const exps = newExperiments
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const created: SubjectOption = {
      code: newCode.trim().toUpperCase(),
      title: newTitle.trim(),
      department: newDepartment.trim() || 'Department of Electrical & Electronic Engineering',
      program: newProgram.trim() || 'B.Sc. in EEE',
      defaultExperiments: exps.length > 0 ? exps : ['Experiment 01: Laboratory Analysis and Study'],
    };

    onAddSubject(created);
    setIsAddingNew(false);
    setNewCode('');
    setNewTitle('');
    setNewExperiments('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Course & Subject Manager
              </h3>
              <p className="text-xs text-stone-500">
                Select a course, add new custom subjects, or delete unwanted items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Action Bar */}
        <div className="p-3 sm:p-3.5 border-b border-stone-100 flex flex-col sm:flex-row gap-2.5 items-center justify-between bg-white">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code or subject..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Department Tabs */}
            <div className="flex p-0.5 bg-stone-100 rounded-lg">
              <button
                onClick={() => setActiveTab('EEE')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'EEE'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                EEE Subjects
              </button>
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'ALL'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Subjects
              </button>
            </div>

            {/* Add New Subject Button */}
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingNew ? 'Close Form' : '+ Add Subject'}</span>
            </button>
          </div>
        </div>

        {/* New Subject Form (Collapsible) */}
        {isAddingNew && (
          <form
            onSubmit={handleCreateSubject}
            className="p-3.5 sm:p-4 bg-emerald-50/70 border-b border-emerald-200 space-y-3 animate-in fade-in"
          >
            <div className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add New Course / Subject
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Course Code *
                </label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. EEE-316"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Course Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Power System Protection Laboratory"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Department
                </label>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Program
                </label>
                <input
                  type="text"
                  value={newProgram}
                  onChange={(e) => setNewProgram(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                Experiments / Topics (One per line)
              </label>
              <textarea
                rows={2}
                value={newExperiments}
                onChange={(e) => setNewExperiments(e.target.value)}
                placeholder="Study of Overcurrent and Directional Relay Characteristics&#10;Differential Protection of Transformer and Tripping Sequence"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-xs"
              >
                Save Subject
              </button>
            </div>
          </form>
        )}

        {/* Subjects List */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-xs">
              No subjects found matching "{searchQuery}"
            </div>
          ) : (
            filtered.map((subject) => {
              const isCurrent = currentCourseCode?.trim() === subject.code.trim();
              const isExpanded = selectedSubjectForExp?.code === subject.code;
              const isConfirmingDelete = confirmDeleteCode === subject.code;

              return (
                <div
                  key={subject.code}
                  className={`border rounded-xl transition-all overflow-hidden ${
                    isCurrent
                      ? 'border-emerald-700 bg-emerald-50/30 ring-1 ring-emerald-700'
                      : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="p-3 flex items-center justify-between gap-3">
                    <div
                      onClick={() => onSelectSubject(subject)}
                      className="cursor-pointer flex-1"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-stone-100 text-stone-900 px-2 py-0.5 rounded border border-stone-200">
                          {subject.code}
                        </span>
                        <span className="font-bold text-xs text-stone-900">
                          {subject.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-emerald-800 text-white font-bold px-1.5 py-0.2 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1">
                        {subject.department} · {subject.defaultExperiments.length} experiments available
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedSubjectForExp(isExpanded ? null : subject)
                        }
                        className="text-[11px] px-2 py-1 text-stone-600 hover:text-emerald-800 font-semibold bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                      >
                        {isExpanded ? 'Hide Exp.' : 'View Exp.'}
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectSubject(subject)}
                        className="px-3 py-1 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg transition-colors shadow-xs"
                      >
                        Select
                      </button>

                      {/* Direct Reliable Inline Delete Subject (No blocked browser popups) */}
                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-0.5 rounded-lg">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSubject(subject.code);
                              setConfirmDeleteCode(null);
                            }}
                            className="px-2 py-1 text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors shadow-xs"
                          >
                            Delete?
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteCode(null);
                            }}
                            className="p-1 text-stone-400 hover:text-stone-700"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteCode(subject.code);
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title={`Delete ${subject.code}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Experiments List for this Course */}
                  {isExpanded && (
                    <div className="p-3 bg-stone-50 border-t border-stone-200 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-700" />
                        Click an Experiment to autofill both Subject and Experiment Title:
                      </div>
                      <div className="space-y-1">
                        {subject.defaultExperiments.map((exp, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => onSelectSubject(subject, exp)}
                            className="w-full text-left p-2 rounded-lg bg-white border border-stone-200 hover:border-emerald-700 hover:bg-emerald-50/50 text-xs text-stone-800 flex items-start gap-2 transition-colors"
                          >
                            <span className="font-mono text-stone-400 shrink-0 font-bold">
                              Exp {idx + 1}:
                            </span>
                            <span className="flex-1 font-medium">{exp}</span>
                            <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 opacity-0 hover:opacity-100" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500">
          <button
            type="button"
            onClick={() => onResetSubjects()}
            className="flex items-center gap-1 text-[11px] text-stone-600 hover:text-emerald-800 font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Official NUB Subjects</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
