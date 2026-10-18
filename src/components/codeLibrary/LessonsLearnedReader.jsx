import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Sparkles,
  Bookmark,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Terminal,
  BookOpen,
  Filter,
  Search,
  ExternalLink,
  Award
} from 'lucide-react';
import EngineerAvatar from './EngineerAvatar';

/**
 * LessonsLearnedReader Component
 * Interactive conversational reader rendering the dialogue between:
 * - Alex Rivera, E.I.T. (Junior Design Engineer)
 * - Dan Miller, P.Eng. (Senior Principal T&D Engineer)
 */
export default function LessonsLearnedReader({
  lessons = [],
  activeLessonId = null,
  onSelectLesson,
  bookmarks = [],
  onToggleBookmark,
  onOpenCalculator,
  searchQuery = ''
}) {
  const [speakerFilter, setSpeakerFilter] = useState('all'); // 'all' | 'junior' | 'senior'
  const [copiedId, setCopiedId] = useState(null);

  // Active lesson selection
  const currentLesson = useMemo(() => {
    if (!lessons || lessons.length === 0) return null;
    if (!activeLessonId) return lessons[0];
    return lessons.find(l => l.id === activeLessonId || l.clauseNumber === activeLessonId) || lessons[0];
  }, [lessons, activeLessonId]);

  const activeIndex = useMemo(() => {
    if (!currentLesson) return 0;
    return lessons.findIndex(l => l.id === currentLesson.id);
  }, [lessons, currentLesson]);

  const handlePrevLesson = () => {
    if (activeIndex > 0 && onSelectLesson) {
      onSelectLesson(lessons[activeIndex - 1]);
    }
  };

  const handleNextLesson = () => {
    if (activeIndex < lessons.length - 1 && onSelectLesson) {
      onSelectLesson(lessons[activeIndex + 1]);
    }
  };

  const handleCopyCitation = (id, text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const isBookmarked = currentLesson ? bookmarks.some(b => b.id === currentLesson.id) : false;

  const calculatorTarget = useMemo(() => {
    if (!currentLesson) return null;
    const sec = currentLesson.section.toLowerCase();
    const title = currentLesson.title.toLowerCase();

    if (title.includes('clearance') || sec.includes('clearance')) {
      return { id: 'clearance', label: 'Clearance Calculator' };
    }
    if (title.includes('autosag') || title.includes('tension') || sec.includes('catenary') || title.includes('weather')) {
      return { id: 'weather', label: 'Weather & PLS-CADD Criteria' };
    }
    if (title.includes('fea') || title.includes('wood pole') || title.includes('guy') || title.includes('coordinate') || title.includes('uplift')) {
      return { id: 'wood_pole', label: 'Wood Pole Structural Engine' };
    }
    return null;
  }, [currentLesson]);

  if (!currentLesson) {
    return (
      <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', borderRadius: '14px' }}>
        <p style={{ color: 'var(--text-muted)' }}>No lessons found matching the selected filter.</p>
      </div>
    );
  }

  // Filter dialogue turns by speaker if requested
  const filteredDialogue = currentLesson.dialogue.filter(turn => {
    if (speakerFilter === 'all') return true;
    if (speakerFilter === 'junior') return turn.speaker === 'junior';
    if (speakerFilter === 'senior') return turn.speaker === 'senior';
    return true;
  });

  return (
    <div className="animate-view-enter" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Lesson Header Hero Card */}
      <div
        className="glass-panel lesson-hero-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative'
        }}
      >
        {/* Top Badges & Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#f59e0b',
                padding: '0.25rem 0.65rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Award size={13} />
              <span>Lesson {currentLesson.clauseNumber}</span>
            </span>

            <span
              style={{
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: 'var(--accent-cyan)',
                padding: '0.25rem 0.65rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}
            >
              {currentLesson.section}
            </span>
          </div>

          {/* Lesson Pagination Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <button
              type="button"
              onClick={handlePrevLesson}
              disabled={activeIndex === 0}
              className="btn-secondary"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.76rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                opacity: activeIndex === 0 ? 0.4 : 1
              }}
              title="Previous Lesson"
            >
              <ChevronLeft size={14} />
              <span>Prev</span>
            </button>

            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', padding: '0 0.3rem', fontWeight: '600' }}>
              {activeIndex + 1} of {lessons.length}
            </span>

            <button
              type="button"
              onClick={handleNextLesson}
              disabled={activeIndex === lessons.length - 1}
              className="btn-secondary"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.76rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                opacity: activeIndex === lessons.length - 1 ? 0.4 : 1
              }}
              title="Next Lesson"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark && onToggleBookmark({
                type: 'clause',
                id: currentLesson.id,
                clauseNumber: currentLesson.clauseNumber,
                standardId: 'pls_cadd_lessons',
                title: currentLesson.title,
                standardName: 'PLS-CADD Lessons'
              })}
              className="btn-secondary"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.76rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: isBookmarked ? '#f59e0b' : 'var(--text-muted)'
              }}
              aria-label={`Bookmark Lesson ${currentLesson.clauseNumber}`}
            >
              <Bookmark size={14} fill={isBookmarked ? '#f59e0b' : 'none'} />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleCopyCitation(currentLesson.id, `PLS-CADD Lessons Learned — Lesson ${currentLesson.clauseNumber}: ${currentLesson.title}`)}
              className="btn-secondary"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.76rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              {copiedId === currentLesson.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedId === currentLesson.id ? 'Copied!' : 'Cite'}</span>
            </button>
          </div>
        </div>

        {/* Lesson Title & Concept Pitch */}
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.5rem', letterSpacing: '-0.01em' }}>
            {currentLesson.title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquare size={14} color="#f59e0b" />
              <span>Conversational Q&A Dialogue</span>
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Terminal size={14} color="var(--accent-cyan)" />
              <span>PLS-CADD & PLS-POLE Workflows</span>
            </span>
            {calculatorTarget && onOpenCalculator && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => onOpenCalculator(calculatorTarget.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--accent-cyan)',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    textDecoration: 'underline'
                  }}
                >
                  <Calculator size={13} />
                  <span>Launch in {calculatorTarget.label}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Speaker Filter Tab Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={13} color="var(--text-muted)" />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>Filter Speaker:</span>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button
                type="button"
                onClick={() => setSpeakerFilter('all')}
                className={speakerFilter === 'all' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', borderRadius: '14px' }}
              >
                All Dialogue
              </button>
              <button
                type="button"
                onClick={() => setSpeakerFilter('junior')}
                className={speakerFilter === 'junior' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', borderRadius: '14px' }}
              >
                Alex (Junior Qs)
              </button>
              <button
                type="button"
                onClick={() => setSpeakerFilter('senior')}
                className={speakerFilter === 'senior' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', borderRadius: '14px' }}
              >
                Dan (Senior As)
              </button>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Showing {filteredDialogue.length} of {currentLesson.dialogue.length} dialogue turns
          </div>
        </div>
      </div>

      {/* Dialogue Stream Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredDialogue.map((turn, tIdx) => {
          const isJunior = turn.speaker === 'junior';

          return (
            <div
              key={`turn_${tIdx}`}
              className={`glass-panel dialogue-turn-card ${isJunior ? 'junior' : 'senior'}`}
            >
              {/* Character Avatar Icon */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                <EngineerAvatar speaker={turn.speaker} size={50} />
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: isJunior ? 'var(--accent-cyan)' : '#f59e0b',
                    background: isJunior ? 'rgba(56, 189, 248, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '10px'
                  }}
                >
                  {isJunior ? 'Junior EIT' : 'Senior Lead'}
                </span>
              </div>

              {/* Speech Bubble Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Character Name & Role Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-main)' }}>
                      {turn.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                      — {turn.role}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      color: isJunior ? 'var(--accent-cyan)' : '#f59e0b'
                    }}
                  >
                    {isJunior ? 'Question & Problem' : 'Engineering Solution'}
                  </span>
                </div>

                {/* Body Text with High Readability */}
                <div className="dialogue-body-text">
                  {turn.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Senior Engineer's Field Rule of Thumb Callout */}
      {currentLesson.proTip && (
        <div className="glass-panel lesson-protip-card">
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              borderRadius: '10px',
              padding: '0.55rem',
              display: 'flex',
              color: '#f59e0b',
              flexShrink: 0
            }}
          >
            <Sparkles size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Dan's Field Rule of Thumb & Pro-Tip
            </div>
            <p className="lesson-protip-text">
              {currentLesson.proTip}
            </p>
          </div>
        </div>
      )}

      {/* Software Paths & CSA Code Citations Footer Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '14px',
          border: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {/* Commands & Hotkeys */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: '0.6rem' }}>
            <Terminal size={14} />
            <span>PLS Commands & Menu Shortcuts</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {currentLesson.plsCommands.map((cmd, cIdx) => (
              <div
                key={`cmd_${cIdx}`}
                className="lesson-pill-item command"
              >
                {cmd}
              </div>
            ))}
          </div>
        </div>

        {/* CSA Standards Referenced */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#10b981', marginBottom: '0.6rem' }}>
            <BookOpen size={14} />
            <span>Governing CSA Standards & Clauses</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {currentLesson.csaCitations.map((cit, citIdx) => (
              <div
                key={`cit_${citIdx}`}
                className="lesson-pill-item citation"
              >
                <span>{cit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
