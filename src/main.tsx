import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Download, FileText, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';
import { projects, site } from './data';
import './styles.css';

const ease = [.22, 1, .36, 1] as const;
const links = [['Work', 'work'], ['About', 'about'], ['Contact', 'contact']] as const;

function Btn({ href, children, plain = false, external = false }: { href: string; children: React.ReactNode; plain?: boolean; external?: boolean }) {
  return <a href={href} className={`btn ${plain ? 'plain' : ''}`} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}<ArrowUpRight size={16} /></a>;
}

function Label({ n }: { n: string }) { return <div className="label">{n}</div>; }

function Reveal({ children, d = 0 }: { children: React.ReactNode; d?: number }) {
  const reduce = useReducedMotion();
  return <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .7, delay: d, ease }}>{children}</motion.div>;
}

function Nav() {
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  const go = (id: string) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  return <>
    <header className="nav glass">
      <button className="brand" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}>Usiju<span>.</span></button>
      <nav>{links.map(([label, id]) => <button key={id} onClick={() => go(id)}>{label}</button>)}</nav>
      <div className="navActions"><a className="navCv" href="/cv/peter-usiju-cv.pdf" target="_blank" rel="noreferrer">CV <Download size={14} /></a><Btn href="#contact">Contact</Btn></div>
      <button className="menu" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
    </header>
    <AnimatePresence>{open && <motion.div className="mobile glass" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <button className="close" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
      {links.map(([label, id]) => <button key={id} onClick={() => go(id)}>{label}<ArrowUpRight /></button>)}
      <a className="mobileCv" href="/cv/peter-usiju-cv.pdf" target="_blank" rel="noreferrer">View CV <Download size={16} /></a>
    </motion.div>}</AnimatePresence>
  </>;
}

function Hero() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (reduce) return;
    const context = gsap.context(() => { gsap.fromTo(photo.current, { scale: .95, y: 20 }, { scale: 1, y: 0, duration: 1, ease: 'power3.out', delay: .16 }); }, root);
    return () => context.revert();
  }, [reduce]);
  return <section className="hero heroLuzia" ref={root}>
    <div className="heroLeft"><h1><span>Digital ideas,</span><span className="blue">made clear.</span></h1></div>
    <div className="heroPhoto" ref={photo}><div className="portrait"><img src="/images/usiju-peter.webp" alt="Usiju Peter" width="640" height="640" fetchPriority="high" decoding="async" /></div></div>
    <motion.div className="heroRight" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .5, ease }}>
      <p>I’m Usiju, a creative developer crafting clear, considered websites and digital experiences that move with purpose.</p>
      <div className="actions"><Btn href="#contact">Start a Conversation</Btn><a className="heroCv" href="/cv/peter-usiju-cv.pdf" target="_blank" rel="noreferrer"><FileText size={16} /> View CV</a></div>
    </motion.div>
    <a className="scroll" href="#work">Scroll to explore <ArrowDown size={15} /></a>
  </section>;
}

function Work() {
  return <section id="work" className="section workSimple">
    <Reveal><div className="workTop"><div><Label n="01 / SELECTED WORK" /><h2>Selected Projects</h2></div></div></Reveal>
    <div className="workTiles">{projects.map((project, index) => <Reveal d={index * .08} key={project.slug}>
      <a className="liveProject" href={project.live} target="_blank" rel="noreferrer" aria-label={`View ${project.title} live website`}>
        <img src={project.image} alt={`${project.title} website preview`} loading="lazy" />
        <span className="projectHover">View Project <ArrowUpRight size={16} /></span>
      </a>
    </Reveal>)}</div>
  </section>;
}

function About() {
  return <section id="about" className="section about">
    <Reveal><Label n="02 / ABOUT ME" /></Reveal>
    <div className="split"><Reveal><h2>A little more about the person behind the pixels.</h2></Reveal><Reveal d={.1}><div className="copy">{site.about.map(item => <p key={item}>{item}</p>)}<div className="pills">{site.skills.map(skill => <span key={skill}>{skill}</span>)}</div></div></Reveal></div>
  </section>;
}

function Contact() {
  const [notice, setNotice] = useState('');
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice('Message delivery will be activated as soon as Usiju’s email is connected.');
  };
  return <section id="contact" className="contact"><Reveal><div className="contactBox glass contactGrid">
    <div><Label n="03 / CONTACT" /><h2>Start a conversation.</h2><p>Have a project, idea, or opportunity in mind? Send a note and let’s make it happen.</p><a className="contactCv" href="/cv/peter-usiju-cv.pdf" target="_blank" rel="noreferrer"><FileText size={16} /> View CV</a></div>
    <form className="contactForm" onSubmit={submit}>
      <label>Name<input name="name" autoComplete="name" required placeholder="Your name" /></label>
      <label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@email.com" /></label>
      <label>Message<textarea name="message" required placeholder="Tell me about your project" rows={4} /></label>
      <button type="submit" className="btn">Send message <ArrowUpRight size={16} /></button>
      {notice && <p className="formNotice" role="status">{notice}</p>}
    </form>
  </div></Reveal></section>;
}

function Footer() {
  return <footer><div><b>Usiju Peter</b><p>Creating thoughtful digital experiences.</p></div><div>{links.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}<a href={site.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={site.socials.x} target="_blank" rel="noreferrer">X</a></div><small>© 2026 Usiju Peter. All rights reserved.</small></footer>;
}

function App() { return <><Nav /><main><Hero /><Work /><About /><Contact /></main><Footer /></>; }

createRoot(document.getElementById('root')!).render(<App />);
