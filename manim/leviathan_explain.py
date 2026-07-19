"""
Leviathan explain scenes in a 3Blue1Brown / Manim style.

Install (Community edition):
  pip install manim
  # system deps: cairo, ffmpeg, latex (optional but recommended)

Render:
  cd manim
  manim -pqh leviathan_explain.py BondScene
  manim -pqh leviathan_explain.py PogScene
  manim -pqh leviathan_explain.py AuditScene
  manim -pqh leviathan_explain.py FullExplain

Outputs land in manim/media/videos/...
"""

from manim import *


class BondScene(Scene):
    def construct(self):
        self.camera.background_color = WHITE
        title = Text("Break-even bond", color=BLACK, font_size=40)
        title.to_edge(UP)
        self.play(FadeIn(title))

        r = MathTex(r"R = \text{round reward}", color=BLACK)
        p = MathTex(r"p \in (0,1]", color=BLACK)
        e = MathTex(r"\mathbb{E}[T] = \frac{1}{p}", color=BLACK)
        b = MathTex(r"B = R \cdot \frac{1-p}{p}", color=BLACK)

        group = VGroup(r, p, e, b).arrange(DOWN, buff=0.55)
        group.move_to(ORIGIN)

        for m in group:
            self.play(Write(m), run_time=1.1)
            self.wait(0.25)

        note = Text(
            "At p = 0.1, B = 9R  ·  lying is expected-negative",
            color=BLACK,
            font_size=24,
        )
        note.next_to(group, DOWN, buff=0.7)
        self.play(FadeIn(note))
        self.wait(1.5)


class PogScene(Scene):
    def construct(self):
        self.camera.background_color = WHITE
        title = Text("Proof of Gradient", color=BLACK, font_size=40)
        title.to_edge(UP)
        self.play(FadeIn(title))

        steps = VGroup(
            MathTex(r"c_i = \mathrm{Commit}(\Delta_i)", color=BLACK),
            MathTex(r"S = \mathrm{Aggregate}_{clip}(\{\Delta_i\})", color=BLACK),
            MathTex(r"\|\Delta_i - \widehat{\Delta}_i\| \le \tau", color=BLACK),
            MathTex(
                r"\mathrm{PoG}_i = R_i\cdot\mathbf{1}[\mathrm{ok}]",
                color=BLACK,
            ),
        ).arrange(DOWN, buff=0.5)

        labels = ["commit", "aggregate", "audit", "mint"]
        for mobj, lab in zip(steps, labels):
            tag = Text(lab, color=GRAY_D, font_size=20).next_to(mobj, LEFT, buff=0.4)
            self.play(FadeIn(tag), Write(mobj), run_time=1.0)
            self.wait(0.2)

        self.wait(1.2)


class AuditScene(Scene):
    def construct(self):
        self.camera.background_color = WHITE
        title = Text("Audit lottery", color=BLACK, font_size=40)
        title.to_edge(UP)
        self.play(FadeIn(title))

        formula = MathTex(r"p=0.1\qquad \mathbb{E}[T]=10", color=BLACK)
        formula.next_to(title, DOWN, buff=0.6)
        self.play(Write(formula))

        honest = VGroup(
            *[
                Square(side_length=0.45, color=BLACK, fill_opacity=0).set_fill(
                    WHITE, 1
                )
                for _ in range(11)
            ]
        ).arrange_in_grid(rows=1, buff=0.12)
        mal = VGroup(
            *[
                Square(side_length=0.45, color=BLACK, fill_opacity=0.15)
                for _ in range(5)
            ]
        ).arrange_in_grid(rows=1, buff=0.12)
        row = VGroup(honest, mal).arrange(RIGHT, buff=0.2)
        row.next_to(formula, DOWN, buff=0.9)
        self.play(FadeIn(row))

        catches = [12, 20, 1, 5, 11]
        mean = sum(catches) / len(catches)
        for sq, t in zip(mal, catches):
            self.play(sq.animate.set_fill(BLACK, 1), run_time=0.35)
            tick = Text(f"r{t}", color=WHITE, font_size=14).move_to(sq)
            self.play(FadeIn(tick), run_time=0.2)
            self.wait(0.15)

        result = MathTex(
            rf"\text{{observed mean }} = {mean:.1f}\text{{ rounds}}",
            color=BLACK,
        )
        result.next_to(row, DOWN, buff=0.8)
        self.play(Write(result))
        self.wait(1.5)


class FullExplain(Scene):
    def construct(self):
        self.camera.background_color = WHITE
        t = Text("Leviathan", color=BLACK, font_size=48)
        s = Text(
            "Trustless training for the people's model",
            color=GRAY_D,
            font_size=26,
        )
        g = VGroup(t, s).arrange(DOWN, buff=0.35)
        self.play(FadeIn(g))
        self.wait(1.0)
        self.play(FadeOut(g))
        self.wait(0.3)
        tip = Text(
            "Render BondScene, PogScene, AuditScene separately",
            color=BLACK,
            font_size=28,
        )
        self.play(FadeIn(tip))
        self.wait(1.2)
