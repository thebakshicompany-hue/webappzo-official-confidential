"use client";

import { useEffect, useRef, useState } from "react";

export default function FarewellModal() {
	const [open, setOpen] = useState(true);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const cardRef = useRef<HTMLDivElement | null>(null);
	const [closing, setClosing] = useState(false);

	const close = () => {
		setClosing(true);
		setTimeout(() => setOpen(false), 450); // match exit animation
	};

	/* lock body scroll + ESC to close while open */
	useEffect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = prev;
			window.removeEventListener("keydown", onKey);
		};
	}, [open]);

	/* 3D scene + tilt — only runs while the popup is open */
	useEffect(() => {
		if (!open) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let disposed = false;
		let rafScene = 0;
		let rafTilt = 0;
		const cleanups: Array<() => void> = [];

		(async () => {
			const THREE = await import("three");
			if (disposed || !canvasRef.current) return;

			let renderer: InstanceType<typeof THREE.WebGLRenderer>;
			try {
				renderer = new THREE.WebGLRenderer({
					canvas: canvasRef.current,
					antialias: true,
					alpha: false,
				});
			} catch {
				canvasRef.current.style.display = "none";
				return;
			}

			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			const scene = new THREE.Scene();
			scene.background = new THREE.Color(0x050203);
			scene.fog = new THREE.Fog(0x050203, 18, 95);

			const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
			camera.position.set(0, 3.2, 26);
			camera.lookAt(0, 2.5, 0);

			const geo = new THREE.PlaneGeometry(220, 120, 110, 60);
			geo.rotateX(-Math.PI / 2);
			const pos = geo.attributes.position as InstanceType<typeof THREE.BufferAttribute>;
			const base = new Float32Array(pos.array.length);
			base.set(pos.array as Float32Array);

			const mat = new THREE.MeshBasicMaterial({
				color: 0x8f1b22,
				wireframe: true,
				transparent: true,
				opacity: 0.5,
			});
			const terrain = new THREE.Mesh(geo, mat);
			terrain.position.y = -1.5;
			scene.add(terrain);

			function radialTex(stops: [number, string][], size: number) {
				const c = document.createElement("canvas");
				c.width = c.height = size;
				const g = c.getContext("2d")!;
				const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
				stops.forEach((s) => grad.addColorStop(s[0], s[1]));
				g.fillStyle = grad;
				g.fillRect(0, 0, size, size);
				return new THREE.CanvasTexture(c);
			}

			const sunTex = radialTex(
				[
					[0, "#fff3ea"],
					[0.25, "#ffb37c"],
					[0.55, "#e5484d"],
					[0.8, "rgba(127,29,36,0.6)"],
					[1, "rgba(127,29,36,0)"],
				],
				512
			);
			const sun = new THREE.Sprite(
				new THREE.SpriteMaterial({ map: sunTex, transparent: true, depthWrite: false })
			);
			sun.scale.set(30, 30, 1);
			sun.position.set(0, 6.5, -70);
			scene.add(sun);

			const haloTex = radialTex(
				[
					[0, "rgba(229,72,77,0.35)"],
					[0.5, "rgba(178,32,40,0.12)"],
					[1, "rgba(178,32,40,0)"],
				],
				512
			);
			const halo = new THREE.Sprite(
				new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false })
			);
			halo.scale.set(110, 70, 1);
			halo.position.set(0, 8, -71);
			scene.add(halo);

			const COUNT = 260;
			const pArr = new Float32Array(COUNT * 3);
			for (let i = 0; i < COUNT; i++) {
				pArr[i * 3] = (Math.random() - 0.5) * 140;
				pArr[i * 3 + 1] = Math.random() * 22;
				pArr[i * 3 + 2] = -Math.random() * 90;
			}
			const pGeo = new THREE.BufferGeometry();
			pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
			const dotTex = radialTex(
				[
					[0, "rgba(255,180,160,1)"],
					[0.4, "rgba(229,72,77,0.6)"],
					[1, "rgba(229,72,77,0)"],
				],
				64
			);
			const particles = new THREE.Points(
				pGeo,
				new THREE.PointsMaterial({
					size: 0.55,
					map: dotTex,
					transparent: true,
					depthWrite: false,
					opacity: 0.7,
					blending: THREE.AdditiveBlending,
				})
			);
			scene.add(particles);

			const clock = new THREE.Clock();
			let mouseX = 0,
				mouseY = 0,
				smX = 0,
				smY = 0;

			const onMove = (e: PointerEvent) => {
				mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
				mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
			};
			window.addEventListener("pointermove", onMove, { passive: true });
			cleanups.push(() => window.removeEventListener("pointermove", onMove));

			const resize = () => {
				const w = window.innerWidth,
					h = window.innerHeight;
				renderer.setSize(w, h, false);
				camera.aspect = w / h;
				camera.updateProjectionMatrix();
			};
			window.addEventListener("resize", resize);
			cleanups.push(() => window.removeEventListener("resize", resize));
			resize();

			cleanups.push(() => {
				geo.dispose();
				mat.dispose();
				pGeo.dispose();
				sunTex.dispose();
				haloTex.dispose();
				dotTex.dispose();
				renderer.dispose();
			});

			let frozen = false;
			const arr = pos.array as Float32Array;

			function tick() {
				if (disposed) return;
				const t = reduce ? 0 : clock.getElapsedTime();

				if (!reduce || !frozen) {
					for (let i = 0; i < pos.count; i++) {
						const x = base[i * 3],
							z = base[i * 3 + 2];
						arr[i * 3 + 1] =
							base[i * 3 + 1] +
							Math.sin(x * 0.14 + t * 0.6) * Math.cos(z * 0.11 + t * 0.4) * 1.4 +
							Math.sin(z * 0.05 + t * 0.25) * 2.2 +
							Math.max(0, Math.abs(x) - 14) * 0.16;
					}
					pos.needsUpdate = true;

					const s = 30 + Math.sin(t * 0.5) * 1.2;
					sun.scale.set(s, s, 1);
					particles.rotation.y = t * 0.008;
					particles.position.y = Math.sin(t * 0.3) * 0.4;

					smX += (mouseX - smX) * 0.03;
					smY += (mouseY - smY) * 0.03;
					camera.position.x = smX * 2.2;
					camera.position.y = 3.2 - smY * 1.1;
					camera.lookAt(0, 2.5, -20);

					renderer.render(scene, camera);
					if (reduce) frozen = true;
				}
				rafScene = requestAnimationFrame(tick);
			}
			tick();
		})();

		/* card tilt */
		if (!reduce && cardRef.current) {
			const card = cardRef.current;
			let tx = 0,
				ty = 0,
				cx = 0,
				cy = 0;
			const onMove = (e: PointerEvent) => {
				tx = e.clientX / window.innerWidth - 0.5;
				ty = e.clientY / window.innerHeight - 0.5;
			};
			window.addEventListener("pointermove", onMove, { passive: true });
			cleanups.push(() => window.removeEventListener("pointermove", onMove));

			const loop = () => {
				if (disposed) return;
				cx += (tx - cx) * 0.06;
				cy += (ty - cy) * 0.06;
				card.style.transform = `rotateY(${cx * 7}deg) rotateX(${-cy * 5}deg)`;
				rafTilt = requestAnimationFrame(loop);
			};
			loop();
		}

		return () => {
			disposed = true;
			cancelAnimationFrame(rafScene);
			cancelAnimationFrame(rafTilt);
			cleanups.forEach((fn) => fn());
		};
	}, [open]);

	if (!open) return null;

	return (
		<div
			className={`fwm-overlay${closing ? " fwm-closing" : ""}`}
			role="dialog"
			aria-modal="true"
			aria-label="Service shutdown announcement"
			onClick={(e) => {
				if (e.target === e.currentTarget) close();
			}}
		>
			<style>{css}</style>

			<canvas ref={canvasRef} className="fwm-scene" aria-hidden="true" />
			<div className="fwm-vignette" aria-hidden="true" />
			<div className="fwm-grain" aria-hidden="true" />

			<button className="fwm-close" onClick={close} aria-label="Close announcement">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<div className="fwm-stage">
				<main className="fwm-card" ref={cardRef}>
					<div className="fwm-fw fwm-fade fwm-layer">
						<div className="fwm-badge">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
								/>
							</svg>
						</div>
					</div>

					<div className="fwm-fw fwm-fade fwm-d1 fwm-layer">
						<h1>
							Every journey has
							<br />
							its <em>sunset.</em>
						</h1>
					</div>

					<div className="fwm-fw fwm-fade fwm-d2 fwm-layer">
						<p className="fwm-lede">
							We are deeply sorry to announce that our platform is winding down operations. Making the
							decision to discontinue a service we built with pride—and that you trusted—was incredibly
							difficult.
						</p>
					</div>

					<div className="fwm-fw fwm-fade fwm-d3 fwm-layer">
						<div className="fwm-rule" />
					</div>

					<div className="fwm-fw fwm-fade fwm-d3 fwm-layer fwm-panel-wrap">
						<div className="fwm-panel">
							<div className="fwm-row">
								<span className="fwm-dot" />
								<div>
									<h3>Data &amp; Accounts</h3>
									<p>
										Download your data and export backups directly from your dashboard until{" "}
										<strong>[Insert Date]</strong>.
									</p>
								</div>
							</div>
							<div className="fwm-row">
								<span className="fwm-dot" />
								<div>
									<h3>Subscriptions</h3>
									<p>All active paid plans have been stopped, and prorated refunds are processing automatically.</p>
								</div>
							</div>
						</div>
					</div>

					<div className="fwm-fw fwm-fade fwm-d4 fwm-layer">
						<div className="fwm-actions">
							<a className="fwm-cta" href="https://forms.gle/njtrcU2xihQXN25N7">
								Contact support
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M14 5l7 7m0 0l-7 7m7-7H3"
									/>
								</svg>
							</a>
							<button className="fwm-dismiss" onClick={close}>
								Continue to dashboard
							</button>
						</div>
					</div>

					<div className="fwm-fw fwm-fade fwm-d5 fwm-layer">
						<footer>Thank you for being part of our story</footer>
					</div>
				</main>
			</div>
		</div>
	);
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600;9..144,700&family=Inter:wght@300;400;500;600&display=swap');

.fwm-overlay{
  --ink:#f5eeee;
  --muted:#a89a9c;
  --dim:#5c4f52;
  --crimson:#e5484d;
  --ember:#ff8a5c;
  position:fixed;inset:0;z-index:9999;
  background:#050203;
  color:var(--ink);
  font-family:'Inter',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  animation:fwm-in .5s cubic-bezier(.16,1,.3,1);
  overflow-y:auto;
}
.fwm-overlay *{margin:0;padding:0;box-sizing:border-box}
@keyframes fwm-in{from{opacity:0}to{opacity:1}}
.fwm-closing{animation:fwm-out .45s cubic-bezier(.16,1,.3,1) forwards}
@keyframes fwm-out{
  from{opacity:1;transform:scale(1)}
  to{opacity:0;transform:scale(1.03)}
}

.fwm-scene{position:absolute;inset:0;width:100%;height:100%;z-index:0;display:block;position:fixed}
.fwm-vignette{
  position:fixed;inset:0;z-index:1;pointer-events:none;
  background:
    radial-gradient(ellipse at 50% 120%, transparent 30%, rgba(5,2,3,.75) 80%),
    linear-gradient(to bottom, rgba(5,2,3,.85) 0%, transparent 30%, transparent 70%, rgba(5,2,3,.9) 100%);
}
.fwm-grain{
  position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.05;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* close button */
.fwm-close{
  position:fixed;top:22px;right:22px;z-index:3;
  width:42px;height:42px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  background:rgba(28,14,17,.6);border:1px solid rgba(229,72,77,.25);
  color:#d8b8ba;cursor:pointer;backdrop-filter:blur(10px);
  transition:all .3s cubic-bezier(.16,1,.3,1);
}
.fwm-close svg{width:18px;height:18px}
.fwm-close:hover{background:rgba(143,22,30,.5);color:#fff;transform:rotate(90deg)}
.fwm-close:focus-visible{outline:2px solid var(--ember);outline-offset:3px}

.fwm-stage{
  position:relative;z-index:2;min-height:100vh;
  display:flex;align-items:center;justify-content:center;
  padding:72px 20px;perspective:1400px;
}

.fwm-card{
  width:min(620px,100%);
  transform-style:preserve-3d;will-change:transform;
  text-align:center;display:flex;flex-direction:column;align-items:center;
}
.fwm-layer,.fwm-fw{transform-style:preserve-3d}
.fwm-panel-wrap{width:100%;display:flex;justify-content:center}

.fwm-badge{
  width:84px;height:84px;border-radius:22px;
  display:flex;align-items:center;justify-content:center;
  background:linear-gradient(140deg,#c1272d 0%,#5e0f16 100%);
  border:1px solid rgba(229,72,77,.4);
  box-shadow:0 24px 48px -12px rgba(178,32,40,.5),inset 0 1px 0 rgba(255,255,255,.22),inset 0 -12px 24px rgba(0,0,0,.35);
  transform:translateZ(90px);
  animation:fwm-bob 6s ease-in-out infinite;
  margin-bottom:36px;
}
.fwm-badge svg{width:40px;height:40px;color:#ffe9e6;filter:drop-shadow(0 2px 6px rgba(0,0,0,.4))}
@keyframes fwm-bob{
  0%,100%{transform:translateZ(90px) translateY(0) rotateZ(0deg)}
  50%{transform:translateZ(90px) translateY(-10px) rotateZ(2deg)}
}

.fwm-card h1{
  font-family:'Fraunces',serif;font-weight:600;
  font-size:clamp(2.3rem,6vw,3.6rem);line-height:1.08;letter-spacing:-.02em;
  transform:translateZ(70px);text-shadow:0 12px 40px rgba(0,0,0,.6);
}
.fwm-card h1 em{
  font-style:italic;font-weight:700;
  background:linear-gradient(100deg,var(--ember) 0%,var(--crimson) 55%,#a8232b 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
}

.fwm-lede{
  margin-top:22px;max-width:46ch;color:var(--muted);
  font-size:clamp(.95rem,2.4vw,1.06rem);font-weight:300;line-height:1.75;
  transform:translateZ(50px);
}

.fwm-rule{
  width:52px;height:2px;margin:34px 0;
  background:linear-gradient(90deg,transparent,var(--crimson),transparent);
  box-shadow:0 0 14px rgba(229,72,77,.55);
  transform:translateZ(40px);
}

.fwm-panel{
  width:min(480px,100%);text-align:left;
  background:linear-gradient(160deg,rgba(28,14,17,.82),rgba(12,6,8,.86));
  border:1px solid rgba(229,72,77,.16);border-top-color:rgba(255,255,255,.1);
  border-radius:18px;padding:26px 28px;
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  box-shadow:0 30px 60px -20px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.06);
  transform:translateZ(55px);
  display:flex;flex-direction:column;gap:18px;
}
.fwm-row{display:flex;gap:14px;align-items:flex-start}
.fwm-dot{
  flex:none;margin-top:5px;width:8px;height:8px;border-radius:50%;
  background:var(--crimson);box-shadow:0 0 10px rgba(229,72,77,.8);
}
.fwm-panel h3{
  font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
  color:#f0a3a3;margin-bottom:4px;
}
.fwm-panel p{font-size:.9rem;line-height:1.65;color:#cabfc0;font-weight:300}
.fwm-panel strong{color:var(--ink);font-weight:500}

.fwm-actions{
  margin-top:40px;transform:translateZ(75px);
  display:flex;flex-direction:column;align-items:center;gap:16px;
}
.fwm-cta{
  position:relative;display:inline-flex;align-items:center;gap:10px;
  padding:14px 30px;border-radius:14px;
  font-size:.95rem;font-weight:500;letter-spacing:.01em;
  color:#ffd9d4;text-decoration:none;
  background:linear-gradient(140deg,rgba(193,39,45,.22),rgba(94,15,22,.3));
  border:1px solid rgba(229,72,77,.45);
  box-shadow:0 0 22px rgba(193,39,45,.18),inset 0 1px 0 rgba(255,255,255,.1);
  transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s,background .35s,color .35s;
}
.fwm-cta:hover{
  transform:translateY(-3px) scale(1.03);
  background:linear-gradient(140deg,#d92c33,#8f161e);color:#fff;
  box-shadow:0 16px 40px -8px rgba(217,44,51,.55),0 0 30px rgba(229,72,77,.35);
}
.fwm-cta:focus-visible{outline:2px solid var(--ember);outline-offset:3px}
.fwm-cta svg{width:16px;height:16px;transition:transform .35s cubic-bezier(.16,1,.3,1)}
.fwm-cta:hover svg{transform:translateX(5px)}

.fwm-dismiss{
  background:none;border:none;cursor:pointer;
  font-family:inherit;font-size:.82rem;letter-spacing:.04em;
  color:var(--dim);text-decoration:underline;text-underline-offset:4px;
  transition:color .3s;
}
.fwm-dismiss:hover{color:var(--muted)}
.fwm-dismiss:focus-visible{outline:2px solid var(--ember);outline-offset:3px;border-radius:4px}

.fwm-card footer{
  margin-top:52px;font-size:.68rem;letter-spacing:.28em;text-transform:uppercase;
  color:var(--dim);transform:translateZ(30px);
}

.fwm-fade{opacity:0;animation:fwm-fadeUp 1.1s cubic-bezier(.16,1,.3,1) forwards}
.fwm-d1{animation-delay:.15s}
.fwm-d2{animation-delay:.3s}
.fwm-d3{animation-delay:.45s}
.fwm-d4{animation-delay:.6s}
.fwm-d5{animation-delay:.75s}
@keyframes fwm-fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}

@media (prefers-reduced-motion: reduce){
  .fwm-overlay,.fwm-overlay *,.fwm-overlay *::before,.fwm-overlay *::after{
    animation-duration:.001s !important;animation-iteration-count:1 !important;transition-duration:.001s !important
  }
  .fwm-fade{opacity:1}
  .fwm-badge{animation:none}
}
`;
