"""Generate the static portfolio. Run with Python 3; no dependencies required."""
from pathlib import Path
from html import escape as esc
import json

ROOT = Path(__file__).resolve().parents[1]
D = json.loads((ROOT / 'content/site.json').read_text())
ARROW = '<span aria-hidden="true">↗</span>'
MARK = '<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M6 31 20 6l14 25H6Z" stroke="currentColor" stroke-width="1.4"/><path d="m12 31 8-15 8 15M3 25h34M20 6v30" stroke="currentColor" stroke-width="1.2"/><circle cx="20" cy="25" r="5" fill="currentColor"/></svg>'
PROJECT_META = [
    ('Autonomy / Reinforcement learning', 'Intelligence emerges together.', 'A multi-agent pursuit environment exploring how autonomous systems learn to sense, coordinate, and capture as a team.', ['Python', 'PettingZoo', 'MATD3'], 'swarm'),
    ('Simulation / Emergent behavior', 'Simple rules. Collective intelligence.', 'A flocking simulation built around alignment, cohesion, and separation, with spatial partitioning for efficient neighbor lookup.', ['Python', 'Pygame', 'Spatial partitioning'], 'boids'),
    ('Automation / Developer tools', 'Your thinking, in sync.', 'Cross-platform note synchronization with Git version history and native desktop notifications.', ['Python', 'Git', 'Automation'], 'sync'),
    ('Automation / Data pipelines', 'Find the signal in the search.', 'A career research tool that collects and filters job openings to make the application process more efficient.', ['Python', 'BeautifulSoup', 'Selenium'], 'data'),
    ('Web / API integration', 'One forecast. Thousands of campuses.', 'A university weather application connecting school discovery, geolocation, and weather services.', ['JavaScript', 'APIs', 'Jest'], 'weather'),
    ('Research / Data analysis', 'Understanding patterns of spread.', 'An exploratory Python project analyzing conditions associated with virus spread and bacterial growth.', ['Python', 'Data analysis'], 'data'),
    ('Hardware / Sensing', 'Sensing for safer roads.', 'A science-fair prototype exploring biological signals and algorithms for detecting impaired driving.', ['Sensors', 'Prototyping', 'Algorithms'], 'sync'),
]
for p, m in zip(D['projects'], PROJECT_META):
    p.update(dict(zip(['category', 'headline', 'summary', 'tags', 'visual'], m)))

def taglist(items):
    return '<ul class="tags">' + ''.join(f'<li>{esc(x)}</li>' for x in items) + '</ul>'

def label(number, title):
    return f'<div class="section-label"><span>{number} /</span> <span data-decode>{title}</span></div>'

def button(href, text, secondary=False):
    return f'<a class="button{" secondary" if secondary else ""}" href="{href}"><span data-decode>{text}</span>{ARROW}</a>'

def shell(title, body, prefix='../', active='', home=False):
    h = prefix + 'html/'
    links = []
    for page, name in [('about','About'),('experience','Experience'),('projects','Projects'),('skills','Skills')]:
        current = 'aria-current="page"' if active == page else ''
        href = '#' + ('work' if page == 'projects' else page) if home else f'{h}{page}.html'
        links.append(f'<a href="{href}" {current}><span data-decode>{name}</span></a>')
    nav = ''.join(links)
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Aditya Sathishkumar — software engineering for aerospace, autonomy, and systems that bridge the digital and physical worlds. Explore experience, projects, and research.">
<meta name="theme-color" content="#080a0a"><meta property="og:title" content="{esc(title)} · Aditya Sathishkumar"><meta property="og:description" content="Software for land, air, and space."><meta property="og:type" content="website">
<title>{esc(title)} · Aditya Sathishkumar</title><link rel="icon" href="{prefix}images/mark.svg" type="image/svg+xml">
<link rel="stylesheet" href="{prefix}css/site.css"><script src="{prefix}javascript/site.js" defer></script>
{'<link rel="stylesheet" href="'+prefix+'css/plume.css">' if home else ''}
{'<script src="'+prefix+'javascript/hero-video.js" defer></script>' if home else ''}
{'<link rel="preload" as="image" href="'+prefix+'images/plume-poster.jpg">' if home else ''}</head>
<body class="{'home' if home else 'inner-page'}"><a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><a class="brand" href="{h}index.html" aria-label="Aditya Sathishkumar home">{MARK}<span>ADITYA<br>SATHISHKUMAR<span class="brand-dot">*</span></span></a>
<button class="menu-toggle" aria-expanded="false" aria-controls="navigation">Menu <span aria-hidden="true">+</span></button>
<nav id="navigation" aria-label="Main navigation">{nav}<a href="{'#contact' if home else h+'contact.html'}"><span data-decode>Contact</span></a><a class="nav-contact" href="{prefix}{D['resume']}" target="_blank" rel="noopener">Résumé <span aria-hidden="true">↗</span></a></nav></header>
<main id="main">{body}</main>
<footer class="site-footer"><div class="footer-top"><a class="brand" href="{h}index.html">{MARK}<span>ADITYA<br>SATHISHKUMAR</span></a><p>Software for land, air, and space.</p><a href="#main">Back to top ↑</a></div><div class="footer-bottom"><span>© 2026 Aditya Sathishkumar</span><span>AD ASTRA PER ASPERA</span><div><a href="{D['github']}" target="_blank" rel="noopener">GitHub ↗</a><a href="{D['linkedin']}" target="_blank" rel="noopener">LinkedIn ↗</a><button class="motion-toggle" aria-pressed="false" hidden>Pause motion</button></div></div></footer></body></html>'''

def page_intro(num, eyebrow, title, description):
    return f'<section class="page-intro wrap">{label(num,eyebrow)}<h1>{title}</h1><p class="intro-copy">{description}</p></section>'

def project_visual(p, prefix):
    kind=p['visual']
    if kind in ['swarm','boids']:
        return f'<div class="simulation" data-simulation="{kind}"><canvas aria-hidden="true"></canvas><span class="visual-label">{ "MULTI-AGENT PURSUIT" if kind == "swarm" else "COLLECTIVE MOTION" } / CONCEPT PREVIEW</span><span class="visual-cross cross-one" aria-hidden="true">+</span><span class="visual-cross cross-two" aria-hidden="true">+</span></div>'
    if kind=='sync':
        return '<div class="diagram sync-diagram" aria-hidden="true"><span class="diagram-orbit"></span><span class="diagram-orbit second"></span><span class="diagram-core">↔</span><span class="diagram-node node-a">01</span><span class="diagram-node node-b">02</span><span class="diagram-node node-c">03</span><span class="visual-label">DISTRIBUTED / CONNECTED</span></div>'
    return '<div class="diagram data-diagram" aria-hidden="true">'+''.join(f'<i style="--i:{i};--bar:{(i*37%67)+20}%"></i>' for i in range(22))+'<span class="visual-label">SIGNAL / SYSTEM / OUTPUT</span></div>'

def project_card(p, prefix='../', featured=False):
    return f'''<a class="project-card {'featured' if featured else ''}" href="{prefix}html/project-{p['slug']}.html">{project_visual(p,prefix)}<div class="project-card-info"><div><span class="eyebrow">{esc(p['category'])}</span><h3><span data-decode>{esc(p['title'])}</span></h3><p>{esc(p['summary'])}</p></div><span class="circle-arrow" aria-hidden="true">↗</span></div></a>'''

def experience_rows(limit=None):
    out=[]
    summaries=[
        'Observability and fault-tolerant infrastructure for New Glenn hardware-in-the-loop testing.',
        'Automation, system verification, and traceability for flight-critical Artemis avionics.',
        'Perception pipelines, gimbal control, and telemetry for autonomous aerial refueling.',
        'Computer vision and sensor fusion for ROS-based lunar rover navigation.',
        'Market analysis and a data-driven outreach strategy for consulting clients.',
        'Simulation and experimental validation of passive cooling materials.',
    ]
    for i,e in enumerate(D['experience'][:limit]):
        dates=e['dates'].replace('04/01/2026 - Current','APR 2026 — PRESENT').replace('08/25/2025 - 12/12/2025','AUG — DEC 2025').replace('01/06/2025 - 07/31/2025','JAN — JUL 2025')
        out.append(f'''<details class="experience-row"><summary><span class="experience-index">0{i+1}</span><div class="experience-company"><h3>{esc(e['company'])}</h3><span>{esc(e['role'])}</span></div><div class="experience-summary"><span class="eyebrow">{esc(e.get('mission', 'RESEARCH & ENGINEERING'))}</span><p>{summaries[i]}</p></div><div class="experience-date"><span>{esc(dates)}</span><span class="expand-icon" aria-hidden="true">+</span></div></summary><div class="experience-detail"><div><span class="eyebrow">{esc(e['location'])}</span><p>{esc(e['impact'])}</p><ul class="impact-list">{''.join('<li>'+esc(x)+'</li>' for x in e['metrics'])}</ul></div><ul class="prose-list">{''.join('<li>'+esc(x)+'</li>' for x in e['bullets'])}</ul></div></details>''')
    return ''.join(out)

def contact_block(prefix='../'):
    return f'''<section class="contact-section wrap" id="contact">{label('05','NEXT / TOGETHER')}<div class="contact-heading"><h2>THE NEXT<br>CHAPTER<span class="accent">↗</span></h2><div><p>Have an interesting problem?<br>Let's build something that matters.</p>{button('mailto:'+D['email'], 'Get in touch')}</div></div><div class="contact-links"><a href="mailto:{D['email']}">{D['email']} ↗</a><a href="{D['linkedin']}" target="_blank" rel="noopener">LinkedIn ↗</a><a href="{D['github']}" target="_blank" rel="noopener">GitHub ↗</a></div></section>'''

def home(prefix):
    h=prefix+'html/'
    return f'''<section class="hero plume-hero" id="landing" aria-labelledby="hero-title">
<div class="plume-visual" aria-hidden="true"><img class="plume-fallback" src="{prefix}images/plume-poster.jpg" alt="" width="1920" height="990" fetchpriority="high"><video class="hero-video" data-src="{prefix}media/rocket-plume.mp4" poster="{prefix}images/plume-poster.jpg" width="1920" height="990" muted loop playsinline preload="none" tabindex="-1"></video></div>
<div class="hero-content"><p class="eyebrow">ADITYA SATHISHKUMAR</p><div class="hero-title-scene">
<h1 id="hero-title">BEYOND THE<br><span data-decode data-intro>HORIZON.</span></h1></div></div>
<div class="hero-bottom"><p class="hero-byline">SOFTWARE FOR LAND, AIR & SPACE.</p><a class="scroll-cue" href="#about"><span class="scroll-label">MEET ADITYA</span><span aria-hidden="true">↓</span></a></div>
</section>
<section class="about-preview wrap" id="about"><div class="about-image"><img src="{prefix}images/spacewalk4.webp" alt="An astronaut above Earth's blue horizon" width="5735" height="5735" loading="lazy"><span class="image-caption">PERSPECTIVE / EVERYTHING STARTS WITH CURIOSITY</span></div><div class="about-preview-copy">{label('01','ABOUT ME')}<h2>GROUNDED.<br>LOOKING UP.</h2><p>I'm Aditya, a Computer Science student at UMass Amherst. I'm drawn to the places where software meets the physical world, and where a good question can become something real.</p><p>Outside engineering: soccer, running, captaining UMass Fusion Dance, and finding the next place to explore.</p>{button(h+'about.html','More about me',True)}</div></section>
<section class="experience-section light-section" id="experience"><div class="wrap">{label('02','MISSION EXPERIENCE')}<div class="heading-row"><h2>REAL SYSTEMS.<br>REAL RESPONSIBILITY.</h2><p>Engineering for demanding environments,<br>from the test lab to the flight line.</p></div><div class="experience-list">{experience_rows(3)}</div><div class="section-end">{button(h+'experience.html','Full experience',True)}<span class="eyebrow">RESEARCH → ENGINEERING → DELIVERY</span></div></div></section>
<section class="work-section wrap" id="work"><div class="section-heading">{label('03','SELECTED WORK')}<span class="eyebrow">IDEAS, BUILT & TESTED</span></div><div class="heading-row"><h2>INTELLIGENCE.<br>IN MOTION.</h2><p>Exploring how software senses,<br>decides, and acts in the world.</p></div><div class="project-grid">{''.join(project_card(p,prefix,i==0) for i,p in enumerate(D['projects'][:3]))}</div><div class="section-end">{button(h+'projects.html','All seven projects',True)}<span class="eyebrow">AUTONOMY / SIMULATION / SYSTEMS</span></div></section>
<section class="capabilities wrap" id="skills">{label('04','ENGINEERING TOOLKIT')}<div class="capability-grid"><h2>FROM THE<br>BIT UP.</h2><div><h3>Systems & software</h3><p>C++ / C / Python<br>Embedded systems / Networking<br>System verification / Integration</p></div><div><h3>Autonomy & intelligence</h3><p>Computer vision / Machine learning<br>Controls / Simulation<br>Hardware-software integration</p></div></div><a class="text-link" href="{h}skills.html">Explore the full toolkit ↗</a></section>
{contact_block(prefix)}'''

def projects_page():
    return page_intro('03','PROJECT INDEX','IDEAS INTO<br>REALITY.','Experiments in autonomy, simulations of collective behavior, and tools that make everyday work better.')+f'<section class="wrap all-projects"><div class="project-grid">'+''.join(project_card(p) for p in D['projects'])+'</div></section>'+contact_block()

def project_page(p):
    return f'''<section class="project-detail-intro wrap"><a class="back-link" href="projects.html">← All projects</a>{label('PROJECT',esc(p['category']))}<h1>{esc(p['title'])}</h1><p class="project-headline">{esc(p['headline'])}</p>{taglist(p['tags'])}</section><div class="wrap project-detail-visual">{project_visual(p,'../')}</div><section class="wrap project-story"><div><span class="eyebrow">OVERVIEW</span><h2>{esc(p['headline'])}</h2><p>{esc(p['summary'])}</p>{'<p class="preview-note">The interactive graphic above is an illustrative browser preview. The original project uses '+esc(p['tags'][0])+'.</p>' if p['visual'] in ['swarm','boids'] else ''}</div><div><span class="eyebrow">IMPLEMENTATION & OUTCOMES</span><ul class="prose-list">{''.join('<li>'+esc(x)+'</li>' for x in p['bullets'])}</ul><a class="text-link" href="{D['github']}" target="_blank" rel="noopener">Explore my GitHub profile ↗</a></div></section><div class="wrap project-bottom">{button('projects.html','Back to all projects',True)}</div>'''

def education():
    e=D['education']
    return f'''<section class="education-section light-section" id="education"><div class="wrap">{label('EDU','ACADEMIC FOUNDATION')}<div class="education-overview"><div><h2>UMASS<br>AMHERST.</h2><p>{esc(e['degree'])}</p><span class="eyebrow">{esc(e['year'])} / COMMONWEALTH HONORS COLLEGE</span></div><div class="gpa"><strong>3.84</strong><span>GPA / 4.00</span></div></div><div class="education-grid"><div><h3>Honors & awards</h3><ul class="clean-list">{''.join('<li>'+esc(x)+'</li>' for x in e['honors'])}</ul><h3>Beyond the classroom</h3><ul class="clean-list">{''.join('<li>'+esc(x)+'</li>' for x in e['activities'])}</ul></div><div><h3>Coursework</h3><ul class="course-list">{''.join('<li><span>'+esc(x['name'])+'</span><span>'+esc(x['language'])+'</span></li>' for x in e['courses'])}</ul></div></div></div></section>'''

def about_page():
    interests=['Aerospace & space','Defense','Autonomy','Guidance, navigation & control','Embedded systems','Robotics','Hardware-software integration','AI & machine learning','Object-oriented design','Simulations','AR / VR','Hardware control']
    return page_intro('01','ABOUT ADITYA','CURIOSITY IS<br>THE CONSTANT.','Engineer. Teammate. Explorer. Always looking for the next challenging problem.')+f'''<section class="wrap about-story"><div class="about-image"><img src="../images/spacewalk4.webp" alt="An astronaut exploring above Earth" width="5735" height="5735"><span class="image-caption">AD ASTRA PER ASPERA</span></div><div><h2>At the intersection<br>of code and the world.</h2>{''.join('<p>'+esc(x)+'</p>' for x in D['about'])}</div></section><section class="wrap interests-section">{label('FOCUS','WHAT DRAWS ME IN')}{taglist(interests)}</section>'''+education()+contact_block()

def skills_page():
    return page_intro('04','CAPABILITIES','TOOLS FOR<br>THE MISSION.','The languages, libraries, and engineering practices behind my work.')+'<section class="wrap skills-grid">'+''.join(f'<section class="skill-group"><span class="eyebrow">0{i+1}</span><h2>{esc(k)}</h2>{taglist(v)}</section>' for i,(k,v) in enumerate(D['skills'].items()))+'</section>'+contact_block()

def contact_page():
    return page_intro('05','ESTABLISH CONTACT',"LET'S BUILD<br>WHAT'S NEXT.",'Aerospace, autonomy, software, or a problem that does not fit neatly into a category. I’d like to hear about it.')+f'''<section class="wrap contact-directory"><a href="mailto:{D['email']}"><span class="eyebrow">01 / EMAIL</span><span>{D['email']}</span>{ARROW}</a><a href="{D['linkedin']}" target="_blank" rel="noopener"><span class="eyebrow">02 / LINKEDIN</span><span>Let's connect</span>{ARROW}</a><a href="{D['github']}" target="_blank" rel="noopener"><span class="eyebrow">03 / GITHUB</span><span>Explore the code</span>{ARROW}</a><a href="../{D['resume']}" target="_blank" rel="noopener"><span class="eyebrow">04 / RÉSUMÉ</span><span>The full picture</span>{ARROW}</a></section><div class="wrap contact-signoff"><span class="tiny-cross">+</span><p>Through hardships,<br>to the stars.</p><span class="eyebrow">AD ASTRA PER ASPERA</span></div>'''

def build():
    (ROOT/'index.html').write_text(shell('Software for land, air & space',home(''),prefix='',home=True))
    pages={'index':('Software for land, air & space',home('../')),'projects':('Selected work',projects_page()),'experience':('Experience',page_intro('02','EXPERIENCE','BUILT WITH<br>PURPOSE.','From aerospace systems to research labs: the teams, missions, and problems that have shaped my engineering.')+'<section class="light-section"><div class="wrap"><div class="experience-list">'+experience_rows()+'</div></div></section>'+contact_block()),'about':('About',about_page()),'academics':('Academics',page_intro('EDU','ACADEMICS','A FOUNDATION<br>FOR EXPLORATION.','Computer Science at the University of Massachusetts Amherst.')+education()),'skills':('Technical skills',skills_page()),'contact':('Contact',contact_page())}
    for name,(title,body) in pages.items():
        (ROOT/f'html/{name}.html').write_text(shell(title,body,active=name,home=name=='index'))
    for p in D['projects']:
        (ROOT/f"html/project-{p['slug']}.html").write_text(shell(p['title'],project_page(p),active='projects'))
    print('Built 15 static pages from content/site.json.')

if __name__=='__main__': build()
