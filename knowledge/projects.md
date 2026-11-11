# Projects — Muhammed Sheheen M T P

## AI Tutor Platform (adaptive coding practice with LLM hints)
Type: project · Period: Aug 2025 – Aug 2026 · Tags: AI Tutor, FastAPI, PostgreSQL, SQLAlchemy, Ollama, qwen2.5-coder, Judge0, React, Vite, Docker, LLM, recommendation

The AI Tutor Platform is a full-stack coding-practice application. Muhammed Sheheen M T P built its backend while working as an AI Engineer at ICFOSS. The problem it addresses is that learners practising programming need instant, level-appropriate feedback and a sensible next problem, not just pass/fail results.

What Sheheen built for the AI Tutor:
- A FastAPI backend with 15 REST endpoints, including register/login, user progress, next recommendation, problem listing, run, validate, submit, one-shot AI feedback, streaming AI feedback, languages and health check
- Authentication with PBKDF2-HMAC-SHA256 password hashing
- An evaluator that sends each test case to Judge0 and compares outputs; "validate" runs tests without saving, while "submit" records the attempt and updates score, level and concept mastery in one transaction
- Learner levels (beginner → intermediate at 5 solved → advanced at 10 solved) and per-concept mastery scores (+0.08 on pass, −0.04 on fail, kept between 0 and 1)
- A recommendation algorithm weighing concept weakness, anti-repetition, productive retry, repeated-failure cooldown, progression fit and spacing
- AI hints from Ollama running qwen2.5-coder:14b, streamed to the frontend, with prompt style adapted to learner level

Stack: Python, FastAPI, PostgreSQL, SQLAlchemy, Judge0, Ollama, React (Vite) with a Monaco-based editor, Docker.

No user counts or performance figures exist for the AI Tutor, so none are claimed.

## Linux Adaptive Tutor (part of the AI Tutor work)
Type: project · Period: Aug 2025 – Aug 2026 · Tags: Linux Adaptive Tutor, adaptive learning, React, Vite, Tailwind CSS, FastAPI, PostgreSQL, Ollama, Judge0, Bash

The Linux Adaptive Tutor is an adaptive Linux learning module that Muhammed Sheheen M T P worked on at ICFOSS as part of the broader AI Tutor effort (referred to in ICFOSS records as the Adaptive Linux Course). It is not a separate product from the AI Tutor Platform.

Features of the Linux Adaptive Tutor:
- Structured lessons, quizzes, practice exercises and guided labs, with learner progress tracking
- Explanations at different levels (standard, layman and beginner-friendly), chosen according to learner performance
- An Ollama-powered AI teacher for explanations
- Judge0-based sandboxed Bash practice

Sheheen's contribution to the Linux Adaptive Tutor covered course-data preparation (240 entries), UI building, backend design and database architecture.

Stack: React, Vite, Tailwind CSS, FastAPI, PostgreSQL, Ollama, Judge0.

## English–Malayalam Neural Machine Translation with NLLB-200
Type: project · Period: Aug 2025 – Aug 2026 · Tags: NMT, machine translation, NLLB-200, LoRA, PEFT, QLoRA, 8-bit quantization, OpenNMT, PyTorch, Hugging Face, Sentence Transformers, LaBSE, ONNX Runtime, FastAPI, Malayalam, BLEU, chrF

Muhammed Sheheen M T P fine-tuned Meta's NLLB-200 Distilled 600M model for English–Malayalam translation as part of his AI Engineer role at ICFOSS.

What Sheheen did on the NLLB-200 translation project:
- Built parallel-corpus preparation and quality-filtering workflows: text normalisation, Unicode correction, language validation, deduplication, length-ratio checks and sentence-alignment review
- Designed semantic filtering with multilingual sentence embeddings (Sentence Transformers / LaBSE) and cosine similarity to remove noisy or weakly aligned sentence pairs
- Fine-tuned NLLB-200 Distilled 600M with Hugging Face Transformers and PEFT/LoRA, handling tokenization, language codes and checkpoints
- Trained on limited GPU resources using 8-bit quantization, gradient checkpointing, gradient accumulation, mixed precision, dynamic padding and batch-size tuning; worked with QLoRA as well
- Ran OpenNMT Transformer training experiments alongside NLLB
- Evaluated translation quality with BLEU and chrF, plus loss and inference checks
- Merged the fine-tuned adapter into the base model, exported it to ONNX Runtime and served it through a local FastAPI translation service

Stack: Python, PyTorch, Hugging Face Transformers, NLLB-200 Distilled 600M, PEFT/LoRA, QLoRA, OpenNMT, Sentence Transformers, ONNX Runtime, FastAPI.

## XO GRID Booking Management & Client Automation System
Type: project · Period: 12 Aug 2025 – 4 Oct 2026 · Tags: XO GRID, Google Apps Script, JavaScript, Google Sheets, Google Forms, Google Drive, workflow automation, booking, payment tracking

The XO GRID Booking Management & Client Automation System is a Google Workspace workflow that Muhammed Sheheen M T P built during his remote Technical Consultant contract with XOGRID, a coworking-space company.

The problem: coworking-space administration meant repeated data entry, monthly sheet updates, document handling, renewal follow-ups and payment-status checks. Sheheen's system organised this around a shared spreadsheet workflow with automated business rules.

Components of the XO GRID system:
- Google Forms for client and booking intake
- Google Sheets for operational and month-based booking records
- Google Drive for client documentation
- Google Apps Script for business-rule automation and record synchronisation

What Sheheen implemented:
- Automated processing of booking and client records, including matching entries across monthly sheets
- Renewal-related record detection with identity/booking matching
- Payment-status handling with daily scheduled processing and edit-triggered updates
- Trigger-setup functions and diagnostic functions for reviewing payment-cycle behaviour
- A review of date-boundary and payment-cycle edge cases to improve reliability

The XO GRID system is a business-process automation project, not an AI project.

## AI-Powered Job Search Automation System (active development)
Type: project · Period: 2026 – present · Tags: n8n, PostgreSQL, pgvector, workflow automation, job search, data extraction, matching, active development

The AI-Powered Job Search Automation System is a personal project that Muhammed Sheheen M T P is actively developing. It aims to automate job discovery and candidate–job matching.

Design of the job search automation system:
- Modular workflows in self-hosted n8n for job discovery, page classification, structured job extraction, verification, candidate–job matching and application preparation
- A PostgreSQL database with tables for candidate profile, skills, projects, jobs, raw discovery data, job sources, verification, matches, applications, companies and follow-ups
- pgvector installed in the local database setup

Current state: the job-discovery workflow (WF-01_JOB_DISCOVERY_V2) runs successfully, and work has moved on to the later extraction and processing stages. The system is still in active development, and not every planned stage is complete.

Stack: n8n (self-hosted), PostgreSQL, pgvector.

## Autonomous USV for Aquatic Waste Detection (B.Tech major project)
Type: project · Period: Dec 2024 – Apr 2025 · Tags: USV, computer vision, YOLOv8, OpenCV, ESP32, WebSocket, IP Webcam, robotics, plastic detection, university project

The Autonomous Unmanned Surface Vehicle (USV) for aquatic waste detection was Muhammed Sheheen M T P's B.Tech major project at College of Engineering Thalassery, carried out in a team of four and submitted in March 2025. The report title is "Unmanned Surface Vehicle (USV) for Efficient Debris Collection". Sheheen worked across every part of the project: dataset, model training, detection code, distance and direction logic, ESP32 control and integration.

The problem: floating plastic in confined water bodies such as ponds, pools and lakes is usually removed by hand, which is slow and labour-intensive.

What the USV includes:
- A catamaran-style boat with PVC hulls and a passive collection tray between the hulls
- A phone camera (IP Webcam app) streaming live video to a laptop
- A YOLOv8 object-detection model, trained on a custom image dataset, that detects floating plastic and estimates its distance and direction
- Movement commands sent over WebSocket to an ESP32-WROOM-32 microcontroller, which drives DC motors through an L298N driver
- Two modes: autonomous (vision-guided navigation toward debris) and remote-controlled

Stack: Python, OpenCV, YOLOv8, ESP32-WROOM-32, WebSocket, IP Webcam.

The USV is a university prototype, not a commercial deployment.

## GestureSync — gesture and voice control (B.Tech mini project)
Type: project · Period: Apr 2024 – Jul 2024 · Tags: GestureSync, computer vision, MediaPipe, OpenCV, speech recognition, PyAudio, PyAutoGUI, human-computer interaction, accessibility

GestureSync is a multimodal human-computer interaction system built as a B.Tech mini project at College of Engineering Thalassery by a team of four (report dated July 2024). Muhammed Sheheen M T P worked across every part of GestureSync: hand tracking, gesture-to-action mapping, voice commands and the GUI.

The problem: existing gesture systems often need special hardware (such as Leap Motion or Kinect), and voice assistants often need internet access. GestureSync combines hand gestures, voice commands and an ordinary GUI using only a standard webcam and microphone.

What GestureSync does:
- Uses a live webcam feed and MediaPipe hand-landmark detection to recognise hand gestures
- Maps gestures to mouse movement, clicks and system volume control
- Uses speech recognition for voice commands such as launching applications
- Provides a GUI for manual control, so users can switch between gesture, voice and manual modes

Accessibility was a stated goal: helping people who find keyboards and mice difficult to use.

Stack: Python, OpenCV, MediaPipe, SpeechRecognition, PyAudio, PyAutoGUI.
