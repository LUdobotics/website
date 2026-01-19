import React, { useState, useEffect, useRef } from 'react';
import { Home, ArrowLeft, ArrowRight } from 'lucide-react';

interface TRDPageProps {
    onBack: () => void;
}

export const TRDPage: React.FC<TRDPageProps> = ({ onBack }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 19;
    const navTimeoutRef = useRef<number | null>(null);
    const [navVisible, setNavVisible] = useState(true);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            showNav();
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'Home') {
                e.preventDefault();
                setCurrentSlide(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                setCurrentSlide(totalSlides - 1);
            } else if (e.key === 'Escape') {
                onBack();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Auto-hide nav
    const showNav = () => {
        setNavVisible(true);
        if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
        navTimeoutRef.current = window.setTimeout(() => {
            setNavVisible(false);
        }, 3000);
    };

    useEffect(() => {
        const handleMouseMove = () => showNav();
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
        };
    }, []);

    const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
    const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

    // CSS as a constant string to match the provided HTML exactly
    const styles = `
    :root {
      --primary-cyan: #00ffff;
      --secondary-blue: #0066ff;
      --accent-magenta: #ff00ff;
      --warning-orange: #ff6b35;
      --success-green: #00ff88;
      --bg-deep: #020810;
      --bg-panel: rgba(10, 20, 40, 0.85);
      --bg-card: rgba(0, 255, 255, 0.03);
      --text-primary: #ffffff;
      --text-secondary: rgba(255, 255, 255, 0.7);
      --text-muted: rgba(255, 255, 255, 0.4);
      --border-glow: rgba(0, 255, 255, 0.3);
      --grid-line: rgba(0, 255, 255, 0.05);
    }
    .trd-container {
      font-family: 'Space Grotesk', sans-serif;
      background: var(--bg-deep);
      color: var(--text-primary);
      line-height: 1.6;
      height: 100vh;
      overflow: hidden;
      position: fixed;
      inset: 0;
      z-index: 50;
    }
    .bg-grid {
      position: absolute;
      inset: 0;
      background-image: 
          linear-gradient(var(--grid-line) 1px, transparent 1px),
          linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: gridPulse 8s ease-in-out infinite;
    }
    @keyframes gridPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
    }
    .bg-glow {
        position: absolute;
        width: 800px;
        height: 800px;
        border-radius: 50%;
        filter: blur(150px);
        opacity: 0.15;
        animation: floatGlow 20s ease-in-out infinite;
    }
    .bg-glow.cyan { background: var(--primary-cyan); top: -200px; left: -200px; }
    .bg-glow.magenta { background: var(--accent-magenta); bottom: -200px; right: -200px; animation-delay: -10s; }
    
    @keyframes floatGlow {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(50px, 30px) scale(1.1); }
        50% { transform: translate(20px, 60px) scale(0.9); }
        75% { transform: translate(-30px, 20px) scale(1.05); }
    }

    .slider-container { position: relative; width: 100%; height: 100vh; overflow: hidden; }
    .slides-wrapper { display: flex; height: 100%; transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1); }
    .slide { min-width: 100%; height: 100%; display: flex; flex-direction: column; padding: 60px 80px; position: relative; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--primary-cyan) transparent; }
    .slide::-webkit-scrollbar { width: 6px; }
    .slide::-webkit-scrollbar-track { background: transparent; }
    .slide::-webkit-scrollbar-thumb { background: var(--primary-cyan); border-radius: 3px; }

    .nav-container {
        position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); z-index: 1000;
        display: flex; align-items: center; gap: 20px; padding: 16px 32px;
        background: var(--bg-panel); border: 1px solid var(--border-glow); border-radius: 50px;
        backdrop-filter: blur(20px); transition: opacity 0.4s ease, transform 0.4s ease;
    }
    .nav-container.hidden-nav { opacity: 0; transform: translateX(-50%) translateY(20px); pointer-events: none; }
    
    .nav-btn {
        width: 48px; height: 48px; border: 2px solid var(--primary-cyan); background: transparent;
        border-radius: 50%; color: var(--primary-cyan); cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: all 0.3s ease; font-size: 20px;
    }
    .nav-btn:hover:not(:disabled) { background: var(--primary-cyan); color: var(--bg-deep); box-shadow: 0 0 30px rgba(0, 255, 255, 0.5); }
    .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    
    .nav-dots { display: flex; gap: 8px; }
    .nav-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--text-muted); cursor: pointer; transition: all 0.3s ease; border: none; }
    .nav-dot.active { background: var(--primary-cyan); box-shadow: 0 0 15px var(--primary-cyan); transform: scale(1.3); }
    
    .slide-counter { font-family: 'Orbitron', sans-serif; font-size: 14px; color: var(--primary-cyan); letter-spacing: 2px; min-width: 80px; text-align: center; }
    
    .progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, var(--primary-cyan), var(--accent-magenta)); z-index: 1001; transition: width 0.3s ease; box-shadow: 0 0 20px var(--primary-cyan); }
    
    .slide-header { margin-bottom: 40px; }
    .slide-badge { display: inline-block; padding: 6px 16px; background: linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.1)); border: 1px solid var(--primary-cyan); border-radius: 20px; font-family: 'Orbitron', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--primary-cyan); margin-bottom: 20px; }
    .slide-title { font-family: 'Orbitron', sans-serif; font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; background: linear-gradient(135deg, #fff 0%, var(--primary-cyan) 50%, var(--accent-magenta) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 16px; line-height: 1.2; }
    .slide-subtitle { font-size: 1.1rem; color: var(--text-secondary); max-width: 600px; }
    
    .content-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; flex: 1; }
    .content-grid.single { grid-template-columns: 1fr; }
    .content-grid.two-col { grid-template-columns: 1fr 1fr; }
    
    .spec-card { background: var(--bg-panel); border: 1px solid var(--border-glow); border-radius: 16px; padding: 28px; position: relative; overflow: hidden; transition: all 0.4s ease; }
    .spec-card:hover { border-color: var(--primary-cyan); box-shadow: 0 10px 40px rgba(0, 255, 255, 0.1); transform: translateY(-4px); }
    .card-icon { width: 56px; height: 56px; background: linear-gradient(135deg, rgba(0, 255, 255, 0.15), rgba(0, 102, 255, 0.1)); border: 1px solid var(--primary-cyan); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px; }
    .card-title { font-family: 'Orbitron', sans-serif; font-size: 1.1rem; font-weight: 600; color: var(--primary-cyan); margin-bottom: 12px; letter-spacing: 1px; }
    .card-content { color: var(--text-secondary); font-size: 0.95rem; }
    .card-content ul { list-style: none; padding: 0; }
    .card-content li { padding: 8px 0; padding-left: 24px; position: relative; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .card-content li::before { content: '▸'; position: absolute; left: 0; color: var(--primary-cyan); }

    .spec-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .spec-table th, .spec-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .spec-table th { font-family: 'Orbitron', sans-serif; font-size: 0.8rem; color: var(--primary-cyan); letter-spacing: 1px; text-transform: uppercase; background: rgba(0, 255, 255, 0.05); }
    
    .screen-preview { background: var(--bg-deep); border: 2px solid var(--border-glow); border-radius: 12px; padding: 24px; position: relative; overflow: hidden; min-height: 400px; }
    .preview-label { position: absolute; top: 12px; left: 16px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; }
    
    /* Utility & Specific UI mocks */
    .feature-tag { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
    .feature-tag.required { background: rgba(255, 0, 100, 0.2); color: #ff6b9d; }
    .feature-tag.new { background: rgba(0, 255, 136, 0.2); color: var(--success-green); }
    .feature-tag.updated { background: rgba(0, 255, 255, 0.2); color: var(--primary-cyan); }
    
    .kbd { display: inline-block; padding: 4px 8px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-primary); }
    
    @media (max-width: 1200px) { .slide { padding: 40px; } .content-grid.two-col { grid-template-columns: 1fr; } }
    @media (max-width: 768px) { .slide { padding: 80px 20px 30px; } .nav-container { width: 90%; justify-content: space-between; } .nav-dots { display: none; } }
  `;

    return (
        <div className="trd-container">
            <style>{styles}</style>

            {/* Home Button - Moved to right-6 */}
            <button
                onClick={onBack}
                className="fixed top-6 right-6 z-[2000] px-6 py-3 bg-[rgba(10,20,40,0.85)] border border-[#00ffff] rounded-full text-[#00ffff] font-['Orbitron'] flex items-center gap-2 hover:bg-[#00ffff] hover:text-[#020810] transition-all group"
            >
                <Home size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold tracking-widest">HOME</span>
            </button>

            {/* Progress Bar */}
            <div className="progress-bar" style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }} />

            {/* Slider */}
            <div className="slider-container">
                <div className="slides-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>

                    {/* Slide 1: Cover */}
                    <section className="slide">
                        <div className="slide-header" style={{ textAlign: 'center', marginTop: 'auto' }}>
                            <div className="slide-badge">Technical Requirements Document v0.6</div>
                            <h1 className="slide-title" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>A ROS 2 ODYSSEY</h1>
                            <p className="slide-subtitle" style={{ maxWidth: '100%', textAlign: 'center', margin: '0 auto 40px' }}>Complete UI/UX Specification for Unity Development</p>

                            <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '60px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '3rem', color: 'var(--primary-cyan)' }}>90+</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>UI Components</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '3rem', color: 'var(--accent-magenta)' }}>3</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chapters</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '3rem', color: 'var(--success-green)' }}>12</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Core Systems</div>
                                </div>
                            </div>
                        </div>

                        <div className="slide-footer" style={{ marginTop: 'auto', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="footer-info" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ubuntu 24.04 LTS • Unity 2022.3.62f3 • 1920×1080</div>
                            <div className="footer-version" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.7rem', color: 'var(--primary-cyan)' }}>TRD v0.6</div>
                        </div>
                    </section>

                    {/* Slide 2: Main Menu */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Screen 01</div>
                            <h1 className="slide-title">Main Menu</h1>
                            <p className="slide-subtitle">Primary entry point with 4 navigation options</p>
                        </div>

                        <div className="content-grid two-col">
                            <div className="screen-preview">
                                <span className="preview-label">Preview</span>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary-cyan)', textShadow: '0 0 40px rgba(0, 255, 255, 0.5)', marginBottom: '8px' }}>A ROS 2</div>
                                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.8rem', fontWeight: 600, color: '#fff', marginBottom: '40px' }}>ODYSSEY</div>
                                    {['LEVEL SELECTION', 'SETTINGS', 'KNOWLEDGE BASE', 'QUIT GAME'].map(btn => (
                                        <div key={btn} style={{ width: '280px', padding: '16px 32px', margin: '8px 0', border: '2px solid var(--primary-cyan)', borderRadius: '8px', color: 'var(--primary-cyan)', fontFamily: 'Orbitron, sans-serif', fontSize: '0.9rem', letterSpacing: '2px' }}>{btn}</div>
                                    ))}
                                </div>
                            </div>

                            <div className="spec-card">
                                <div className="card-icon">📋</div>
                                <h3 className="card-title">Specifications</h3>
                                <div className="card-content">
                                    <table className="spec-table">
                                        <tbody>
                                            <tr><th>Element</th><th>Requirement</th></tr>
                                            <tr><td>Level Selection</td><td>Navigate to chapter/level picker with scores</td></tr>
                                            <tr><td>Settings</td><td>Audio, Video, Language, Accessibility</td></tr>
                                            <tr><td>Knowledge Base</td><td>Access collected KB entries</td></tr>
                                            <tr><td>Quit Game</td><td>Exit application with confirmation</td></tr>
                                            <tr><td>Background</td><td>Animated with Odie robot character</td></tr>
                                            <tr><td>Version Tag</td><td>Display build version (alpha 2.23)</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 3: Level Selection */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Screen 02</div>
                            <h1 className="slide-title">Level Selection</h1>
                            <p className="slide-subtitle">Chapter and level picker with player scores</p>
                        </div>
                        <div className="content-grid two-col">
                            <div className="screen-preview">
                                <span className="preview-label">Preview</span>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '16px', padding: '20px' }}>
                                    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--primary-cyan)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'Orbitron', fontSize: '2rem', color: 'var(--primary-cyan)' }}>01</div>
                                        <div style={{ fontSize: '0.9rem', margin: '12px 0' }}>Door Logic</div>
                                        <div style={{ color: '#ffd700' }}>★★★</div>
                                    </div>
                                    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-glow)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'Orbitron', fontSize: '2rem', color: 'var(--primary-cyan)' }}>02</div>
                                        <div style={{ fontSize: '0.9rem', margin: '12px 0' }}>Sensors</div>
                                        <div style={{ color: '#ffd700' }}>★★<span style={{ color: 'var(--text-muted)' }}>☆</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="spec-card">
                                <div className="card-icon">🎮</div>
                                <h3 className="card-title">Requirements</h3>
                                <div className="card-content">
                                    <ul>
                                        <li>Display all available chapters/levels</li>
                                        <li>Show player score below each level <span className="feature-tag new">NEW</span></li>
                                        <li>Star rating system (3 stars max)</li>
                                        <li>Lock indicator for incomplete prerequisites</li>
                                        <li>Chapter thumbnails or icons</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 4: Settings */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Screen 03</div>
                            <h1 className="slide-title">Settings Menu</h1>
                            <p className="slide-subtitle">Audio, Video, Language, and Accessibility options</p>
                        </div>
                        <div className="content-grid two-col">
                            <div className="screen-preview">
                                <span className="preview-label">Preview</span>
                                <div style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border-glow)' }}>
                                        <div style={{ padding: '10px 20px', background: 'rgba(0,255,255,0.1)', color: 'var(--primary-cyan)', borderBottom: '2px solid var(--primary-cyan)' }}>AUDIO</div>
                                        <div style={{ padding: '10px 20px', color: 'var(--text-muted)' }}>VIDEO</div>
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Music Volume</span><span>70%</span></div>
                                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}><div style={{ width: '70%', height: '100%', background: 'var(--primary-cyan)' }} /></div>
                                    </div>
                                </div>
                            </div>
                            <div className="spec-card">
                                <div className="card-icon">⚙️</div>
                                <h3 className="card-title">Settings Categories</h3>
                                <div className="card-content">
                                    <table className="spec-table">
                                        <tbody>
                                            <tr><th>Category</th><th>Options</th></tr>
                                            <tr><td>Audio</td><td>Music Volume, SFX Volume</td></tr>
                                            <tr><td>Video</td><td>Resolution, Quality, Fullscreen</td></tr>
                                            <tr><td>Language</td><td>LeanLocalization dropdown</td></tr>
                                            <tr><td>Accessibility</td><td>Colorblind Mode, Text Scale <span className="feature-tag new">NEW</span></td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 5: In-Game HUD */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Screen 04</div>
                            <h1 className="slide-title">In-Game HUD</h1>
                            <p className="slide-subtitle">Persistent heads-up display during gameplay</p>
                        </div>

                        <div className="content-grid two-col">
                            <div className="screen-preview">
                                <span className="preview-label">Preview</span>
                                <div style={{ position: 'relative', height: '100%', minHeight: '350px' }}>
                                    <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 12 }}>
                                        <div style={{ width: 44, height: 44, border: '1px solid var(--border-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>⚙️</div>
                                        <div style={{ width: 44, height: 44, border: '1px solid var(--border-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>📋</div>
                                    </div>

                                    <div style={{ position: 'absolute', top: 20, right: 20, width: 250, border: '1px solid var(--border-glow)', borderRadius: 12, overflow: 'hidden' }}>
                                        <div style={{ padding: 12, background: 'rgba(0,255,255,0.1)', borderBottom: '1px solid var(--border-glow)', display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', color: 'var(--primary-cyan)' }}>MISSIONS</span>
                                        </div>
                                        <div style={{ padding: 12 }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--success-green)', marginBottom: 4 }}>✓ Open airlock</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>○ Go to deck</div>
                                        </div>
                                    </div>

                                    <div style={{ position: 'absolute', bottom: 20, left: 20, padding: '12px 20px', border: '1px solid var(--border-glow)', borderRadius: 10 }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SCORE</div>
                                        <div style={{ fontFamily: 'Orbitron', fontSize: '1.5rem', color: 'var(--success-green)' }}>2,450</div>
                                    </div>
                                </div>
                            </div>

                            <div className="spec-card">
                                <div className="card-icon">🖥️</div>
                                <h3 className="card-title">HUD Elements</h3>
                                <div className="card-content">
                                    <ul>
                                        <li>Settings button (top-left)</li>
                                        <li>Inventory/KB button (top-left)</li>
                                        <li>Mission panel (expandable, right side)</li>
                                        <li>Score display <span className="feature-tag new">NEW</span></li>
                                        <li>Hint request button <span className="feature-tag new">NEW</span></li>
                                        <li>Timer display (when active)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 6: Mission Panel */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Screen 05</div>
                            <h1 className="slide-title">Mission System UI</h1>
                            <p className="slide-subtitle">Vertical mission list with dynamic states</p>
                        </div>
                        <div className="content-grid">
                            <div className="spec-card">
                                <div className="card-icon">📋</div>
                                <h3 className="card-title">Mission States</h3>
                                <div className="card-content">
                                    <table className="spec-table">
                                        <tbody>
                                            <tr><th>State</th><th>Visual</th><th>Behavior</th></tr>
                                            <tr><td><span className="feature-tag">Inactive</span></td><td>Hidden/Gray</td><td>Not yet triggered</td></tr>
                                            <tr><td><span className="feature-tag updated">Active</span></td><td>Highlighted</td><td>Current objective</td></tr>
                                            <tr><td><span className="feature-tag new">Completed</span></td><td>Checkmark</td><td>Objective achieved</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 7: Scoring */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Screen 06 <span className="feature-tag new">NEW</span></div>
                            <h1 className="slide-title">Scoring System</h1>
                            <p className="slide-subtitle">Player rating and certification tracking</p>
                        </div>

                        <div className="content-grid two-col">
                            <div className="screen-preview">
                                <span className="preview-label">End-of-Level Rating</span>
                                <div style={{ padding: 40, textAlign: 'center' }}>
                                    <div style={{ fontFamily: 'Orbitron', fontSize: '1.5rem', color: 'var(--success-green)', marginBottom: 30 }}>MISSION COMPLETE!</div>
                                    <div style={{ width: 180, height: 180, borderRadius: '50%', border: '4px solid var(--border-glow)', margin: '0 auto 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ fontFamily: 'Orbitron', fontSize: '3rem', color: 'var(--success-green)' }}>2,450</div>
                                        <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 3,000</div>
                                    </div>
                                    <div style={{ fontSize: '2rem' }}>
                                        <span style={{ color: '#ffd700' }}>★</span>
                                        <span style={{ color: '#ffd700' }}>★</span>
                                        <span style={{ color: 'var(--text-muted)' }}>☆</span>
                                    </div>
                                </div>
                            </div>

                            <div className="spec-card">
                                <div className="card-icon">🏆</div>
                                <h3 className="card-title">Scoring Mechanics</h3>
                                <div className="card-content">
                                    <ul>
                                        <li>Score starts high, decreases with hints</li>
                                        <li>Level-specific efficiency scoring</li>
                                        <li>Display rating at end of each level</li>
                                        <li>Certification unlock (post-MVP)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 8: Hints */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Screen 07 <span className="feature-tag new">NEW</span></div>
                            <h1 className="slide-title">Hints System</h1>
                            <p className="slide-subtitle">Player assistance with score penalty</p>
                        </div>

                        <div className="content-grid two-col">
                            <div className="screen-preview">
                                <span className="preview-label">Hint Panel</span>
                                <div style={{ padding: 20 }}>
                                    <div style={{ padding: 16, background: 'rgba(255, 107, 53, 0.1)', border: '1px solid var(--warning-orange)', borderRadius: 10, marginBottom: 20, display: 'flex', gap: 12 }}>
                                        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                                        <span style={{ color: 'var(--warning-orange)', fontSize: '0.85rem' }}>Using hints will reduce your final score!</span>
                                    </div>

                                    <div style={{ padding: 16, background: 'var(--bg-panel)', border: '1px solid var(--border-glow)', borderRadius: 10, marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: 4 }}>Hint 1: Getting Started</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Learn about the terminal basics</div>
                                        </div>
                                        <span style={{ padding: '6px 12px', background: 'rgba(255, 107, 53, 0.2)', borderRadius: 6, color: 'var(--warning-orange)', fontFamily: 'Orbitron', fontSize: '0.8rem' }}>-100 pts</span>
                                    </div>
                                </div>
                            </div>

                            <div className="spec-card">
                                <div className="card-icon">💡</div>
                                <h3 className="card-title">Hint Requirements</h3>
                                <div className="card-content">
                                    <ul>
                                        <li>Display hints on player request</li>
                                        <li>Progressive hint system (multiple levels)</li>
                                        <li>Clear score penalty warning</li>
                                        <li>Each hint has associated point cost</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 9: Terminal */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Screen 08</div>
                            <h1 className="slide-title">Terminal Interface</h1>
                            <p className="slide-subtitle">ROS 2 command input and output display</p>
                        </div>
                        <div className="content-grid two-col">
                            <div className="screen-preview">
                                <span className="preview-label">In-Game Terminal</span>
                                <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', height: '100%', minHeight: '300px' }}>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27ca40' }} />
                                    </div>
                                    <div style={{ lineHeight: 1.8 }}>
                                        <span style={{ color: 'var(--success-green)' }}>odie@ROS 2:~$ </span>
                                        <span style={{ color: '#fff' }}>ROS 2 topic list</span>
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', paddingLeft: 16 }}>/cmd_vel</div>
                                    <div style={{ color: 'var(--text-secondary)', paddingLeft: 16 }}>/scan</div>
                                </div>
                            </div>
                            <div className="spec-card">
                                <div className="card-icon">💻</div>
                                <h3 className="card-title">Terminal Modes</h3>
                                <div className="card-content">
                                    <ul>
                                        <li>In-Game Terminal: Streamed output, scrollable</li>
                                        <li>External Terminal: System terminal integration</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 10: KB */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Screen 09</div>
                            <h1 className="slide-title">Knowledge Base</h1>
                            <p className="slide-subtitle">Educational content discovery</p>
                        </div>
                        <div className="content-grid two-col">
                            <div className="screen-preview">
                                <span className="preview-label">KB Grid View</span>
                                <div style={{ padding: 20 }}>
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                                        <span style={{ padding: '8px 16px', border: '1px solid var(--primary-cyan)', borderRadius: 20, background: 'var(--primary-cyan)', color: 'black', fontSize: '0.8rem' }}>All</span>
                                        <span style={{ padding: '8px 16px', border: '1px solid var(--border-glow)', borderRadius: 20, fontSize: '0.8rem' }}>CLI</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                                        <div style={{ padding: 16, border: '1px solid var(--border-glow)', borderRadius: 10 }}>
                                            <div style={{ fontSize: '0.85rem' }}>ROS 2 topic list</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CLI Commands</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="spec-card">
                                <div className="card-icon">📚</div>
                                <h3 className="card-title">KB Structure</h3>
                                <div className="card-content">
                                    <table className="spec-table">
                                        <tbody>
                                            <tr><th>Field</th><th>Description</th></tr>
                                            <tr><td>ID</td><td>Internal identifier</td></tr>
                                            <tr><td>Title</td><td>LeanLocalization key</td></tr>
                                            <tr><td>IsUnlocked</td><td>Visibility flag</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 11: Inventory */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Screen 10</div>
                            <h1 className="slide-title">Inventory System</h1>
                            <p className="slide-subtitle">Datapads, currency, and items</p>
                        </div>
                        <div className="content-grid">
                            <div className="spec-card">
                                <div className="card-icon">🎒</div>
                                <h3 className="card-title">Inventory Features</h3>
                                <div className="card-content">
                                    <ul>
                                        <li>Stores: Datapads, Currency, Story Items</li>
                                        <li>Grid or list layout</li>
                                        <li>Scrollable content viewer</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 12: Dialogue */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Screen 11</div>
                            <h1 className="slide-title">Dialogue Bubbles</h1>
                            <p className="slide-subtitle">World-anchored speech bubbles</p>
                        </div>
                        <div className="content-grid two-col">
                            <div className="screen-preview">
                                <span className="preview-label">Dialogue</span>
                                <div style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div style={{ alignSelf: 'flex-start', padding: '16px 20px', background: 'var(--bg-panel)', border: '1px solid var(--border-glow)', borderRadius: '16px 16px 16px 4px', maxWidth: '70%' }}>
                                        <div style={{ fontFamily: 'Orbitron', fontSize: '0.75rem', color: 'var(--primary-cyan)', marginBottom: 8 }}>ODIE</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Welcome to ROS 2 training!</div>
                                    </div>
                                </div>
                            </div>
                            <div className="spec-card">
                                <div className="card-icon">💬</div>
                                <h3 className="card-title">Dialogue Requirements</h3>
                                <div className="card-content">
                                    <ul>
                                        <li>Speech bubble–based</li>
                                        <li>Typewriter effect <span className="feature-tag required">REQUIRED</span></li>
                                        <li>LeanLocalization text</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 13: Notifications */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Screen 12</div>
                            <h1 className="slide-title">Notifications</h1>
                            <p className="slide-subtitle">Feedback for unlocks and alerts</p>
                        </div>
                        <div className="content-grid">
                            <div className="spec-card">
                                <div className="card-icon">🔔</div>
                                <h3 className="card-title">Notification Types</h3>
                                <div className="card-content">
                                    <table className="spec-table">
                                        <tbody>
                                            <tr><th>Type</th><th>Trigger</th></tr>
                                            <tr><td><span style={{ color: 'var(--success-green)' }}>Success</span></td><td>Mission complete</td></tr>
                                            <tr><td><span style={{ color: 'var(--primary-cyan)' }}>Info</span></td><td>KB unlock</td></tr>
                                            <tr><td><span style={{ color: 'var(--warning-orange)' }}>Warning</span></td><td>Time low</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 14: RTS */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Screen 13 <span className="feature-tag updated">CHAPTER 3</span></div>
                            <h1 className="slide-title">Space/RTS Interface</h1>
                            <p className="slide-subtitle">Top-down strategy view</p>
                        </div>
                        <div className="content-grid">
                            <div className="spec-card">
                                <div className="card-icon">🚀</div>
                                <h3 className="card-title">Chapter 3 Specific UI</h3>
                                <div className="card-content">
                                    <ul>
                                        <li>Resources counters <span className="feature-tag new">NEW</span></li>
                                        <li>Drones shown on top-down RTS map</li>
                                        <li>Minimap with unit positions</li>
                                        <li>Unit selection panel</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 15: Audio */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">System Spec</div>
                            <h1 className="slide-title">Audio Requirements</h1>
                            <p className="slide-subtitle">Sound effects for UI feedback</p>
                        </div>
                        <div className="content-grid">
                            <div className="spec-card">
                                <div className="card-icon">🔊</div>
                                <h3 className="card-title">Required Audio Assets</h3>
                                <div className="card-content">
                                    <table className="spec-table">
                                        <tbody>
                                            <tr><th>Sound</th><th>Trigger</th></tr>
                                            <tr><td>UI Click</td><td>Button press</td></tr>
                                            <tr><td>Dialogue Typewriter</td><td>Letter reveal</td></tr>
                                            <tr><td>Mission Complete</td><td>Objective achieved</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 16: Save/Load */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">System Spec</div>
                            <h1 className="slide-title">Save/Load System</h1>
                            <p className="slide-subtitle">Persistent game state</p>
                        </div>
                        <div className="content-grid">
                            <div className="spec-card">
                                <div className="card-icon">💾</div>
                                <h3 className="card-title">Saved Data</h3>
                                <div className="card-content">
                                    <table className="spec-table">
                                        <tbody>
                                            <tr><td>Mission States</td><td>Inventory</td></tr>
                                            <tr><td>KB Flags</td><td>Chapter State</td></tr>
                                            <tr><td>Scores</td><td>Player Settings</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 17: Summary */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Summary</div>
                            <h1 className="slide-title">Technical Summary</h1>
                            <p className="slide-subtitle">Overview</p>
                        </div>
                        <div className="content-grid">
                            <div className="spec-card">
                                <div className="card-icon">🎯</div>
                                <h3 className="card-title">Platform & Performance</h3>
                                <div className="card-content">
                                    <ul>
                                        <li>Platform: Ubuntu 24.04 LTS</li>
                                        <li>Engine: Unity 2022.3.62f3</li>
                                        <li>Render Pipeline: URP</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="spec-card">
                                <div className="card-icon">📊</div>
                                <h3 className="card-title">UI Module Count</h3>
                                <div className="card-content">
                                    <div style={{ fontSize: '2rem', fontFamily: 'Orbitron', color: 'var(--primary-cyan)' }}>90+</div>
                                    <div>Total Components</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 18: Shortcuts */}
                    <section className="slide">
                        <div className="slide-header">
                            <div className="slide-badge">Reference</div>
                            <h1 className="slide-title">Quick Access Keys</h1>
                        </div>
                        <div className="content-grid">
                            <div className="spec-card">
                                <div className="card-icon">⌨️</div>
                                <h3 className="card-title">Recommended Hotkeys</h3>
                                <div className="card-content">
                                    <table className="spec-table">
                                        <tbody>
                                            <tr><th>Key</th><th>Action</th></tr>
                                            <tr><td><span className="kbd">ESC</span></td><td>Pause</td></tr>
                                            <tr><td><span className="kbd">TAB</span></td><td>Terminal</td></tr>
                                            <tr><td><span className="kbd">I</span></td><td>Inventory</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Slide 19: End */}
                    <section className="slide">
                        <div className="slide-header" style={{ textAlign: 'center', margin: 'auto' }}>
                            <div className="slide-badge">End of Specification</div>
                            <h1 className="slide-title">Ready for Development</h1>
                            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 60 }}>
                                <div style={{ padding: '24px 40px', background: 'var(--bg-panel)', border: '1px solid var(--success-green)', borderRadius: 12 }}>
                                    <div style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', color: 'var(--success-green)', marginBottom: 8 }}>STATUS</div>
                                    <div style={{ fontSize: '1.5rem' }}>Complete</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Navigation */}
            <nav className={`nav-container ${!navVisible ? 'hidden-nav' : ''}`}>
                <button className="nav-btn" onClick={prevSlide} disabled={currentSlide === 0} aria-label="Previous">
                    <ArrowLeft size={20} />
                </button>
                <div className="nav-dots">
                    {Array.from({ length: totalSlides }).map((_, i) => (
                        <button
                            key={i}
                            className={`nav-dot ${i === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(i)}
                        />
                    ))}
                </div>
                <span className="slide-counter">{String(currentSlide + 1).padStart(2, '0')} / {totalSlides}</span>
                <button className="nav-btn" onClick={nextSlide} disabled={currentSlide === totalSlides - 1} aria-label="Next">
                    <ArrowRight size={20} />
                </button>
            </nav>
        </div>
    );
};