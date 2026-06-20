# Ultralearning

[![Ultralearning](./infographic.png)](./slide_deck.pdf)

| [Flashcards](./flashcards.html) | [Quiz](./quiz.html) | [Report](./report.md) | [Report 2](./report_2.md) | [Report 3](./report_3.md) | [Mind Map](./mind_map.json) | [Source](./source.pdf) |

## Key Concepts

- **Directness:** learn in the context where performance will be judged; build, speak, solve, and practice instead of only consuming theory
- **Metalearning:** map why, what, and how before starting so the project has a clear path and avoids analysis paralysis
- **Ruthless feedback loops:** accelerate skill by practicing publicly, seeking real critique, and correcting quickly
- **Focus calibration:** match arousal to task complexity: intense alertness for simple drills and relaxed focus for complex work
- **Self-directed mastery:** use high-intensity learning to escape credential dependence and build rare, marketable capability

## Metalearning

```mermaid
flowchart LR

%% LEFT SIDE
subgraph L[Metalearning Procedure Steps]
direction TB
    P1[1. Define the learning project]
    P2[2. Define the real destination]
    P3[3. Identify your motivation]
    P4[4. Define the final performance]
    P5[5. Benchmark the field]
    P6[6. Break into Concepts, Facts, Procedures]
    P7[7. Identify bottlenecks]
    P8[8. Choose learning methods]
    P9[9. Build a practice loop]
    P10[10. Create learning artifacts]
    P11[11. Use the 10% rule]
    P12[12. Start before the map is perfect]
    P13[13. Reassess weekly]
    P14[14. Emphasize / Exclude]
    P15[15. Define your done condition]
end

%% SPACER COLUMN
subgraph S[" "]
direction TB
    S1[" "]
    S2[" "]
    S3[" "]
    S4[" "]
    S5[" "]
end

%% RIGHT SIDE
subgraph R[Short Ultralearning Map]
direction TB
    M1[Why]
    M2[What]
    M3[How]
    M4[Main bottleneck]
    M5[Final goal]
end

%% INVISIBLE SPACING LINKS
L ~~~ S
S ~~~ R

%% CLEAR MAPPINGS
P1 --> M1
P2 --> M1
P3 --> M1

P4 --> M5

P5 --> M2
P6 --> M2

P7 --> M4

P8 --> M3
P9 --> M3
P10 --> M3
P11 --> M3
P12 --> M3
P13 --> M3
P14 --> M3

P15 --> M5

%% STYLING
classDef procedure fill:#E8F1FF,stroke:#2F5AA8,stroke-width:1px,color:#111;
classDef map fill:#FFF3D6,stroke:#B7791F,stroke-width:1px,color:#111;
classDef spacer fill:#ffffff,stroke:#ffffff,color:#ffffff;

class P1,P2,P3,P4,P5,P6,P7,P8,P9,P10,P11,P12,P13,P14,P15 procedure;
class M1,M2,M3,M4,M5 map;
class S1,S2,S3,S4,S5 spacer;
```