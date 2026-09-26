import json
import re

local_raw = [
    # 1-6 ACCOUNTING AND FINANCIAL MANAGEMENT
    {
        "num": 1,
        "title": "Public Sector Accounting Procedure and Standards",
        "category": "Accounting and Financial Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
        "schedule": "March 2–6 (Ibafo), April 13–17 (Ilorin), Sept 7–11 (Abuja)"
    },
    {
        "num": 2,
        "title": "Accounts Reconciliation Technique and Cash Management Strategies for Accounting and Financial Reporting Efficiency",
        "category": "Accounting and Financial Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
        "schedule": "March 9–13 (Ibafo), April 13–17 (Ilorin), Sept 7–11 (Abuja)"
    },
    {
        "num": 3,
        "title": "Finance for Non-Finance Staff",
        "category": "Accounting and Financial Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement",
        "schedule": "April 13–17 (Ilorin), July 20–24 (Keffi), Aug 3–7 (Abuja), Oct 12–16 (Lagos)"
    },
    {
        "num": 4,
        "title": "Public Sector Budgeting and Budget Reforms & Implementation Efficiency",
        "category": "Accounting and Financial Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior Management Staff - Finance, Audit, Procurement Dept.",
        "schedule": "April 13–17 (Ibafo), June 1–5 (Abuja), Oct 5–9 (Ilorin)"
    },
    {
        "num": 5,
        "title": "Corporate Social Responsibility For the Private and Public Sectors (MDAs)",
        "category": "Accounting and Financial Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff - ALL Departments",
        "schedule": "March 9–13 (Abuja), April 6–10 (Ibafo), Aug 31–Sept 4 (Ilorin)"
    },
    {
        "num": 6,
        "title": "Financial Management Skills & Strategies in the Public Sector",
        "category": "Accounting and Financial Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "May 4–8 (Keffi), Aug 10–14 (Abuja), Dec 7–11 (Lagos)"
    },

    # 7-32 GENERAL ADMINISTRATION AND MANAGEMENT
    {
        "num": 7,
        "title": "Customer Relationship Management and Retention",
        "category": "General Administration and Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "May 18–22 (Ibafo), Aug 17–21 (Abuja), Oct 5–9 (Ilorin)"
    },
    {
        "num": 8,
        "title": "Translating Policies into Economic Transformation of Public and Private Sectors' Economy",
        "category": "General Administration and Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "May 4–8 (Abuja), Aug 3–7 (Ilorin), Nov 2–6 (Lagos)"
    },
    {
        "num": 9,
        "title": "A Modern Approach to Procurement: A Strategic Perspective",
        "category": "General Administration and Management",
        "fee": 450000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
        "schedule": "Jul 6–10 (Abuja), Aug 3–7 (Ibafo), Oct 5–9 (Ilorin)"
    },
    {
        "num": 10,
        "title": "Middle Level Management Techniques: New Perspectives",
        "category": "General Administration and Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "May 4–8 (Ibafo), July 6–10 (Ilorin), Oct 19–23 (Abuja), Nov 30–Dec 4 (Keffi)"
    },
    {
        "num": 11,
        "title": "Next Generation HR: Aligning HR to Strategy: Transforming Human Resources to Human Capital",
        "category": "General Administration and Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "HR, Admin, Procurement, Senior & Middle level Mgt Staff",
        "schedule": "April 20–24 (Ibafo), July 6–10 (Ilorin), Oct 12–16 (Abuja)"
    },
    {
        "num": 12,
        "title": "Ethical Standards and Organisational Development in the Public Service",
        "category": "General Administration and Management",
        "fee": 450000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "July 13–17 (Keffi), Aug 24–28 (Abuja), Oct 12–16 (Ilorin), Nov 30–Dec 4 (Lagos)"
    },
    {
        "num": 13,
        "title": "Improved Productivity Based on a Good Performance Culture",
        "category": "General Administration and Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff - ALL Depts.",
        "schedule": "Sept 7–11 (Abuja), Oct 12–16 (Ibafo), Nov 23–27 (Lagos)"
    },
    {
        "num": 14,
        "title": "Pension Administration and Management Strategies",
        "category": "General Administration and Management",
        "fee": 350000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff - ALL Depts.",
        "schedule": "May 4–8 (Ilorin), July 13–17 (Abuja), Oct 19–23 (Keffi)"
    },
    {
        "num": 15,
        "title": "Building Strong Financial Management Strategies to Sustain Organisational Growth",
        "category": "General Administration and Management",
        "fee": 450000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
        "schedule": "April 13–17 (Abuja), July 13–17 (Ilorin), Sept 14–18 (Ibafo)"
    },
    {
        "num": 16,
        "title": "Pre & Post Service Empowerment Training Programme - (2 Weeks)",
        "category": "General Administration and Management",
        "fee": 800000,
        "currency": "NGN",
        "duration": "2 Weeks",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "Nov 23–27 (Lagos), Mar 23–April 4 (Ibafo)"
    },
    {
        "num": 17,
        "title": "Interpersonal Relationships Skills",
        "category": "General Administration and Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "June 8–12 (Abuja), Aug 17–21 (Ilorin), Oct 19–23 (Keffi), Nov 30–Dec 4 (Lagos)"
    },
    {
        "num": 18,
        "title": "Public and Private Sector Corporate Governance",
        "category": "General Administration and Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
        "schedule": "May 11–15 (Ilorin), Aug 10–14 (Abuja), Sept 14–18 (Lagos)"
    },
    {
        "num": 19,
        "title": "Public Sector Management: Making Reforms Effective",
        "category": "General Administration and Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "July 13–17 (Ilorin), Sept 14–18 (Abuja), Nov 23–27 (Lagos), Nov 30–Dec 4 (Keffi)"
    },
    {
        "num": 20,
        "title": "Strategic Leadership Through Technological Innovation Workshop",
        "category": "General Administration and Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "May 18–22 (Abuja), Aug 24–28 (Ibafo), Oct 5–9 (Ilorin)"
    },
    {
        "num": 21,
        "title": "Leading High Performing Teams For Improved Productivity Workshop",
        "category": "General Administration and Management",
        "fee": 395000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "July 13–17 (Abuja), Oct 12–16 (Lagos), Nov 2–6 (Keffi), Dec 7–11 (Ilorin)"
    },
    {
        "num": 22,
        "title": "Preparing For Retirement from the Beginning",
        "category": "General Administration and Management",
        "fee": 450000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "May 4–8 (Abuja), Oct 12–16 (Ilorin), Nov 9–13 (Lagos)"
    },
    {
        "num": 23,
        "title": "Emerging Trends in Human Resources Management: Post Covid-19 Approaches",
        "category": "General Administration and Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "May 4–8 (Keffi), Aug 10–14 (Ilorin), Oct 12–16 (Abuja)"
    },
    {
        "num": 24,
        "title": "Train-the-Trainers Workshop – (2 Weeks)",
        "category": "General Administration and Management",
        "fee": 800000,
        "currency": "NGN",
        "duration": "2 Weeks",
        "target": "HR, Training & Admin Staff",
        "schedule": "March 16–20 (Ilorin), Sept 7–11 (Abuja), Oct 12–16 (Ibafo)"
    },
    {
        "num": 25,
        "title": "Emotional Intelligence and Productivity in Work Place",
        "category": "General Administration and Management",
        "fee": 450000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "July 13–17 (Abuja), Sept 14–18 (Keffi), Nov 2–6 (Lagos), Nov 30–Dec 4 (Abuja & Keffi)"
    },
    {
        "num": 26,
        "title": "Emerging Trends in Board Room Management: Roles of Company Secretary and Board Effectiveness",
        "category": "General Administration and Management",
        "fee": 450000,
        "currency": "NGN",
        "target": "Staff of CEO & ECs (SAs) office, and Commission Secretariat",
        "schedule": "July 6–10 (Abuja), Oct 5–9 (Ilorin), Nov 9–13 (Lagos)"
    },
    {
        "num": 27,
        "title": "Management of Virtual Business Models in the Private and Public Sectors: Future Prerequisite For Self-Employment",
        "category": "General Administration and Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "May 18–22 (Ilorin)"
    },
    {
        "num": 28,
        "title": "Developing Leadership Competencies for Improved Productivity",
        "category": "General Administration and Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "Sept 21–25 (Abuja)"
    },
    {
        "num": 29,
        "title": "Effective Communication Skills for Staff in the Public and Private Sector",
        "category": "General Administration and Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "June 22–26 (Abuja), Sept 7–11 (Lagos), Nov 9–13 (Ilorin), Dec 7–11 (Lagos)"
    },
    {
        "num": 30,
        "title": "Report Writing and Presentation Skills for Staff in the Public and Private Sector",
        "category": "General Administration and Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "June 1–5 (Ilorin), Aug 17–21 (Abuja), Oct 12–16 (Lagos)"
    },
    {
        "num": 31,
        "title": "Workshop on Office Ethics and WorkLife Balance for Staff",
        "category": "General Administration and Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff ALL - Depts.",
        "schedule": "July 20–24 (Ilorin), Oct 19–23 (Lagos), Nov 30–Dec 4 (Abuja)"
    },
    {
        "num": 32,
        "title": "ICT Tools as Enabler For Improved Productivity in the Workplace",
        "category": "General Administration and Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff ALL - Depts.",
        "schedule": "June 22–26 (Keffi), Aug 10–14 (Abuja), Oct 26–30 (Lagos), Nov 30–Dec 4 (Ilorin)"
    },

    # 33-36 TELECOM AND OTHER UTILITIES REGULATION AND RATE DETERMINATION
    {
        "num": 33,
        "title": "Regulatory and Operational Strategies for Telecom Executives",
        "category": "Telecom & Utilities Regulation",
        "fee": 390000,
        "currency": "NGN",
        "target": "Board Members and Executive Management Staff",
        "schedule": "May 11–15 (Ilorin), Aug 3–7 (Lagos), Oct 5–9 (Abuja)"
    },
    {
        "num": 34,
        "title": "Next Generation Challenges & Opportunities for Telecom Senior Executives",
        "category": "Telecom & Utilities Regulation",
        "fee": 450000,
        "currency": "NGN",
        "target": "Board Members and Executive Management Staff",
        "schedule": "Aug 17–21 (Ilorin), Oct 12–16 (Abuja), Dec 7–11 (Lagos)"
    },
    {
        "num": 35,
        "title": "Effective Leadership and Corporate Governance For Directors & Senior Management Staff",
        "category": "Telecom & Utilities Regulation",
        "fee": 450000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "July 6–10 (Ilorin), Sept 14–18 (Abuja), Oct 19–23 (Lagos)"
    },
    {
        "num": 36,
        "title": "Regulatory Compliance Monitoring and Enforcement in Telecom, Power, Pension and Basic Sectors of the Economy",
        "category": "Telecom & Utilities Regulation",
        "fee": 450000,
        "currency": "NGN",
        "target": "Board Members and Executive Management Staff",
        "schedule": "April 20–24 (Abuja), July 13–17 (Ilorin), Sept 14–18 (Abuja & Ibafo), Oct 19–23 (Lagos)"
    },

    # 37-46 CONSUMERS PROTECTION APPRECIATION AND ENGAGEMENTS
    {
        "num": 37,
        "title": "Economics of Regulation and Rates Determination For Utilities Management",
        "category": "Consumer Protection & Utilities",
        "fee": 450000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "July 13–17 (Abuja), Nov 9–13 (Lagos)"
    },
    {
        "num": 38,
        "title": "Regulations and Consumer Protection in the Nigerian Economy: Prospects and Challenges",
        "category": "Consumer Protection & Utilities",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "June 15–19 (Abuja), Aug 10–14 (Lagos), Sept 14–18 (Ilorin), Nov 16–20 (Abuja)"
    },
    {
        "num": 39,
        "title": "Telecom For Beginners and Non-Engineers",
        "category": "Consumer Protection & Utilities",
        "fee": 450000,
        "currency": "NGN",
        "target": "Snr/Middle Level Mgt Staff",
        "schedule": "June 15–19 (Abuja), Aug 17–21 (Ilorin), Oct 19–23 (Abuja), Nov 9–13 (Lagos), Nov 30–Dec 4 (Ilorin)"
    },
    {
        "num": 40,
        "title": "Code of Practice Regulation For Regulators: Public and Private sectors of the Nigerian Economy",
        "category": "Consumer Protection & Utilities",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "Aug 17–21 (Ibafo), Oct 19–23 (Abuja)"
    },
    {
        "num": 41,
        "title": "Regulation and Protection Strategies in Telecom, Power and other Utilities",
        "category": "Consumer Protection & Utilities",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "July 20–24 (Ilorin), Oct 12–16 (Abuja)"
    },
    {
        "num": 42,
        "title": "Evaluation of Quality of Experience of Consumers – Feeling the Pulse",
        "category": "Consumer Protection & Utilities",
        "fee": 450000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "July 13–17 (Ilorin), Aug 17–21 (Abuja), Oct 26–30 (Lagos)"
    },
    {
        "num": 43,
        "title": "Cyber Crime and Cyber Security: Prospects & Challenges",
        "category": "Consumer Protection & Utilities",
        "fee": 450000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "July 20–24 (Ilorin), Sept 14–18 (Ibafo), Oct 12–16 (Abuja), Nov 16–20 (Lagos), Dec 7–11 (Abuja)"
    },
    {
        "num": 44,
        "title": "Capacity-Building Workshop on ICT Literacy and Security Awareness",
        "category": "Consumer Protection & Utilities",
        "fee": 450000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "July 13–17 (Ilorin), Aug 10–14 (Abuja), Sept 14–18 (Lagos), Nov 2–6 (Abuja), Dec 7–11 (Lagos)"
    },
    {
        "num": 45,
        "title": "Managing Consumer Expectations & Customer Retention",
        "category": "Consumer Protection & Utilities",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "Aug 17–21 (Abuja), Oct 12–16 (Lagos), Nov 9–13 (Keffi)"
    },
    {
        "num": 46,
        "title": "Customers Experience Management Workshop",
        "category": "Consumer Protection & Utilities",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "July 6–10 (Lagos), Sept 7–11 (Abuja), Oct 19–23 (Ilorin), Nov 23–27 (Abuja)"
    },

    # 47-52 ENVIRONMENTAL SUSTAINABILITY AND MANAGEMENT
    {
        "num": 47,
        "title": "Telecom Installations and Radiation: Environmental Impact, Assessment and Quality",
        "category": "Environmental Sustainability & Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "May 4–8 (Ilorin), July 6–10 (Abuja), Sept 14–18 (Ibafo), Oct 26–30 (Lagos)"
    },
    {
        "num": 48,
        "title": "Global Environmental Change and Development Impact",
        "category": "Environmental Sustainability & Management",
        "fee": 350000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
        "schedule": "March 16–20 (Ilorin), Aug 10–14 (Abuja), Nov 9–13 (Abuja)"
    },
    {
        "num": 49,
        "title": "Environmental Sustainability and Development Strategies",
        "category": "Environmental Sustainability & Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "March 23–27 (Ibafo), Nov 16–20 (Ilorin)"
    },
    {
        "num": 50,
        "title": "Environmental Protection Issues - Prospects and Challenges: Draught, Deforestation, Afforestation, Desert Encroachment, Water and Air Pollution, Oil Spillage, Erosion Control Mechanism",
        "category": "Environmental Sustainability & Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "May 4–8 (Ibafo), July 6–10 (Abuja), Sept 7–11 (Ilorin)"
    },
    {
        "num": 51,
        "title": "Climate Change and Agricultural Development Strategies",
        "category": "Environmental Sustainability & Management",
        "fee": 350000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "March 23–27 (Ilorin), Nov 2–6 (Ibafo)"
    },
    {
        "num": 52,
        "title": "Soil Management and Food Production Techniques",
        "category": "Environmental Sustainability & Management",
        "fee": 300000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "Nov 16–20 (Ilorin)"
    },

    # 53-55 OIL AND GAS SECTOR
    {
        "num": 53,
        "title": "International Oil and Gas Development Strategies: Upstream / Downstream Segments",
        "category": "Oil & Gas Sector",
        "fee": 450000,
        "currency": "NGN",
        "target": "HR, Admin, Procurement, Senior & Middle level Mgt Staff",
        "schedule": "Aug 3–7 (Abuja), Oct 5–9 (Ibafo)"
    },
    {
        "num": 54,
        "title": "Local Content Development Strategies in the Oil and Gas Industry",
        "category": "Oil & Gas Sector",
        "fee": 450000,
        "currency": "NGN",
        "target": "Top/Senior & Middle Level Mgt",
        "schedule": "June 8–12 (Ilorin), Oct 5–9 (Abuja)"
    },
    {
        "num": 55,
        "title": "Building Capacity in Environmental Management: Best Practices in the Oil and Gas Industry",
        "category": "Oil & Gas Sector",
        "fee": 450000,
        "currency": "NGN",
        "target": "Top/Senior & Middle Level Mgt",
        "schedule": "May 11–15 (Abuja), July 13–17 (Lagos), Sept 7–11 (Abuja), Nov 9–13 (Lagos)"
    },

    # 56-60 SECRETARIAL ADMINISTRATION AND MANAGEMENT
    {
        "num": 56,
        "title": "Skill Enhancement for Secretaries and PAs",
        "category": "Secretarial Administration & Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Secretaries",
        "schedule": "July 13–17 (Abuja), Aug 3–7 (Ilorin), Oct 5–9 (Keffi), Nov 16–20 (Lagos)"
    },
    {
        "num": 57,
        "title": "Modern Secretarial Administration Techniques in the Computerisation Era",
        "category": "Secretarial Administration & Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Secretaries",
        "schedule": "June 1–5 (Ilorin), Aug 17–21 (Abuja), Oct 12–16 (Keffi)"
    },
    {
        "num": 58,
        "title": "Executive Secretarial Management: The New Strategies",
        "category": "Secretarial Administration & Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior level Secretaries",
        "schedule": "June 8–12 (Ilorin), Sept 7–11 (Abuja), Nov 2–6 (Ibafo), Nov 30–Dec 4 (Keffi)"
    },
    {
        "num": 59,
        "title": "Excel and Power Point Preparation Skill for Secretaries",
        "category": "Secretarial Administration & Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Secretaries, PAs",
        "schedule": "May 18–22 (Ilorin), Oct 5–9 (Ibafo)"
    },
    {
        "num": 60,
        "title": "Basic Management Workshop For Secretaries and Personal Assistants",
        "category": "Secretarial Administration & Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Secretaries, PAs",
        "schedule": "June 8–12 (Abuja), Aug 31–Sept 4 (Ilorin)"
    },

    # 61-64 CAPITAL MARKET / SECURITIES & STOCK MANAGEMENT
    {
        "num": 61,
        "title": "Capital Market: Development and Regulations",
        "category": "Capital Market & Securities Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "May 11–15 (Abuja), Aug 3–7 (Ilorin)"
    },
    {
        "num": 62,
        "title": "Securities/Stock Market Development and Management",
        "category": "Capital Market & Securities Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "June 1–5 (Abuja), Nov 9–13 (Ibafo)"
    },
    {
        "num": 63,
        "title": "Capital Market Management: Foundation of Development and Regulation",
        "category": "Capital Market & Securities Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
        "schedule": "Aug 3–7 (Ilorin), Sept 7–11 (Abuja), Nov 16–20 (Ibafo)"
    },
    {
        "num": 64,
        "title": "Alternative Securities Market: Raising Capital for Businesses",
        "category": "Capital Market & Securities Management",
        "fee": 350000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "June 8–12 (Lagos), Nov 2–6 (Ilorin)"
    },

    # 65-67 INFORMATION TECHNOLOGY WORKSHOPS
    {
        "num": 65,
        "title": "Strategies Against Cybersecurity Vulnerability and Threats",
        "category": "Information Technology Workshops",
        "fee": 450000,
        "currency": "NGN",
        "target": "Senior and Middle Level Staff",
        "schedule": "July 13–17 (Keffi), Aug 17–21 (Abuja), Oct 5–9 (Ibafo), Dec 7–11 (Lagos)"
    },
    {
        "num": 66,
        "title": "Microsoft Excel For Managers, Accountants, Statisticians: Intermediate",
        "category": "Information Technology Workshops",
        "fee": 300000,
        "currency": "NGN",
        "target": "Senior Level Staff",
        "schedule": "June 1–5 (Abuja), Nov 2–6 (Abuja)"
    },
    {
        "num": 67,
        "title": "Microsoft Excel For Managers, Accountants, Statisticians: Advanced",
        "category": "Information Technology Workshops",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior Level Staff",
        "schedule": "Aug 3–7 (Ibafo), Sept 14–18 (Ilorin), Nov 16–20 (Abuja)"
    },

    # 68-75 LEGAL AND LEGISLATIVE
    {
        "num": 68,
        "title": "The Role of Public Servants in Legal, Political and Social Development in Nigeria",
        "category": "Legal & Legislative Studies",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "June 15–19 (Abuja), Aug 10–14 (Abuja)"
    },
    {
        "num": 69,
        "title": "Public Service in a Constitutional Democracy: The Prospects and Challenges",
        "category": "Legal & Legislative Studies",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "March 9–13 (Ilorin), July 20–24 (Abuja)"
    },
    {
        "num": 70,
        "title": "Fundamentals of Legislative Drafting",
        "category": "Legal & Legislative Studies",
        "fee": 400000,
        "currency": "NGN",
        "target": "Legal Dept. Staff",
        "schedule": "Oct 19–23 (Abuja)"
    },
    {
        "num": 71,
        "title": "Rule of Law and Good Governance",
        "category": "Legal & Legislative Studies",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "Sept 14–18 (Ilorin)"
    },
    {
        "num": 72,
        "title": "Law Makers and Legislative Process",
        "category": "Legal & Legislative Studies",
        "fee": 390000,
        "currency": "NGN",
        "target": "Legislators & Related Staff",
        "schedule": "Apr 13–17 (Abuja)"
    },
    {
        "num": 73,
        "title": "Law Making as a Catalyst for National Development",
        "category": "Legal & Legislative Studies",
        "fee": 400000,
        "currency": "NGN",
        "target": "Legislators & Related Staff",
        "schedule": "Apr 20–24 (Abuja)"
    },
    {
        "num": 74,
        "title": "Legislature as Sustainers of Democracy",
        "category": "Legal & Legislative Studies",
        "fee": 390000,
        "currency": "NGN",
        "target": "Legislators & Related Staff",
        "schedule": "June 15–19 (Abuja)"
    },
    {
        "num": 75,
        "title": "Orientation and Induction for Legislators",
        "category": "Legal & Legislative Studies",
        "fee": 600000,
        "currency": "NGN",
        "target": "Legislators & Related Staff",
        "schedule": "June 22–26 (Abuja)"
    },

    # 76-84 OIL & GAS - POWER AND ENERGY SECTOR COURSES
    {
        "num": 76,
        "title": "International Oil and Gas Management Development Strategies: Upstream / Downstream Segments",
        "category": "Power & Energy Sector",
        "fee": 450000,
        "currency": "NGN",
        "target": "HR, Admin, Procurement, Senior & Middle level Mgt Staff",
        "schedule": "April 13–17 (Ibafo), July 13–17 (Abuja)"
    },
    {
        "num": 77,
        "title": "Building Capacity in Environmental Management: Best Practices in the Oil and Gas Industry",
        "category": "Power & Energy Sector",
        "fee": 400000,
        "currency": "NGN",
        "target": "Top/Senior & Middle Level Mgt",
        "schedule": "May 11–15 (Lagos), Aug 17–21 (Lagos), Nov 9–13 (Abuja)"
    },
    {
        "num": 78,
        "title": "Power Sector Reforms and the Impacts on Economic Development of the Nation",
        "category": "Power & Energy Sector",
        "fee": 400000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "June 15–19 (Abuja), Sept 7–11 (Ilorin)"
    },
    {
        "num": 79,
        "title": "Unbundling the Power Sector: Prospects For Economic Growth",
        "category": "Power & Energy Sector",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "July 13–17 (Abuja)"
    },
    {
        "num": 80,
        "title": "Tariff and Rate Setting Management For Utilities (Telecoms and Power Sectors): The Impact on Customers",
        "category": "Power & Energy Sector",
        "fee": 450000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "Aug 24–28 (Lagos), Nov 9–13 (Abuja)"
    },
    {
        "num": 81,
        "title": "Best Practices and Performance Management for Strategic Improvements in the Power Sector (Electricity and Oil & Gas Industry)",
        "category": "Power & Energy Sector",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "June 8–12 (Abuja), Nov 16–20 (Ibafo)"
    },
    {
        "num": 82,
        "title": "Corporate Governance as a Potent Corruption Prevention and Mitigation Strategy in the Energy and Telecom Sectors",
        "category": "Power & Energy Sector",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "April 13–17 (Ilorin), Sept 21–25 (Abuja)"
    },
    {
        "num": 83,
        "title": "Specialised Train - The Trainers Workshop for the Utility Managers in all sectors of the Economy",
        "category": "Power & Energy Sector",
        "fee": 450000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "June 15–19 (Abuja), Oct 12–16 (Ilorin)"
    },
    {
        "num": 84,
        "title": "Effective Corporate Communication For The Telecom, Oil & Gas, and Power & Energy Sectors",
        "category": "Power & Energy Sector",
        "fee": 450000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "June 15–19 (Abuja), Nov 16–20 (Ibafo)"
    },

    # 85-91 MARITIME / TRANSPORTATION
    {
        "num": 85,
        "title": "Strategic Planning for the Protection of Marine Environment: Prospects and Challenges",
        "category": "Maritime & Transportation",
        "fee": 450000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "Aug 3–7 (Abuja), Oct 5–9 (Lagos & Ibafo)"
    },
    {
        "num": 86,
        "title": "Leadership Role for Ports Managers for Improved Productivity",
        "category": "Maritime & Transportation",
        "fee": 450000,
        "currency": "NGN",
        "target": "Top/Senior & Middle Level Mgt",
        "schedule": "June 1–5 (Ibafo), Oct 12–16 (Abuja)"
    },
    {
        "num": 87,
        "title": "Economic Importance of Ports to National Development",
        "category": "Maritime & Transportation",
        "fee": 450000,
        "currency": "NGN",
        "target": "Top/Senior & Middle Level Mgt",
        "schedule": "May 18–22 (Ibafo), Nov 2–6 (Abuja)"
    },
    {
        "num": 88,
        "title": "Building Capacity in Environmental Management: Best Practices in the Maritime Industry – NPA, NIMASA, Shippers Council, etc.",
        "category": "Maritime & Transportation",
        "fee": 450000,
        "currency": "NGN",
        "target": "Top/Senior & Middle Level Mgt",
        "schedule": "June 15–19 (Ibafo), Aug 10–14 (Abuja), Oct 12–16 (Lagos & Ibafo)"
    },
    {
        "num": 89,
        "title": "Managing Infractions at the Seaports For Improved Productivity",
        "category": "Maritime & Transportation",
        "fee": 450000,
        "currency": "NGN",
        "target": "Top/Senior & Middle Level Mgt",
        "schedule": "April 6–10 (Lagos), July 13–17 (Ilorin), Sept 14–18 (Abuja)"
    },
    {
        "num": 90,
        "title": "Revenue Generation Strategies for Maritime Sector Players",
        "category": "Maritime & Transportation",
        "fee": 450000,
        "currency": "NGN",
        "target": "Top/Senior & Middle Level Mgt",
        "schedule": "May 11–15 (Abuja), July 13–17 (Lagos), Nov 16–20 (Ilorin)"
    },
    {
        "num": 91,
        "title": "Modern Strategies For Managing Environmental Hazards At The Seaports",
        "category": "Maritime & Transportation",
        "fee": 450000,
        "currency": "NGN",
        "target": "Top/Senior & Middle Level Mgt",
        "schedule": "Aug 10–14 (Lagos)"
    },

    # 92-99 PENSION MANAGEMENT
    {
        "num": 92,
        "title": "Strategic Thinking For Ensuring Compliance of Employers of Pensionable Workers for Service Delivery – PENCOM & PFAs, CPFAs",
        "category": "Pension Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "May 11–15 (Ilorin), Aug 10–14 (Abuja), Oct 19–23 (Lagos)"
    },
    {
        "num": 93,
        "title": "Critical Thinking and Problem Solving for Pension Managers and Regulators",
        "category": "Pension Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Top/Senior & Middle Level Mgt",
        "schedule": "June 8–12 (Ilorin), Oct 5–9 (Abuja)"
    },
    {
        "num": 94,
        "title": "Effective Communication and Capacity Building For Pension Administrators and Regulators",
        "category": "Pension Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Top/Senior & Middle Level Mgt",
        "schedule": "May 18–22 (Ilorin), Sept 14–18 (Lagos), Nov 9–13 (Abuja)"
    },
    {
        "num": 95,
        "title": "Current Strategies For Pension Administration For Effective Service Delivery",
        "category": "Pension Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Senior & Middle Level Mgt Staff – ALL Depts.",
        "schedule": "May 11–15 (Abuja), July 20–24 (Lagos), Oct 19–23 (Keffi)"
    },
    {
        "num": 96,
        "title": "Strategies for Effective Business Communication",
        "category": "Pension Management",
        "fee": 400000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "May 11–15 (Ilorin), Aug 17–21 (Abuja), Oct 12–16 (Lagos)"
    },
    {
        "num": 97,
        "title": "Next Generation Challenges & Opportunities for Pension Administrators",
        "category": "Pension Management",
        "fee": 300000,
        "currency": "NGN",
        "target": "Senior & Middle level Mgt Staff",
        "schedule": "July 13–17 (Ilorin), Sept 14–18 (Abuja), Oct 19–23 (Lagos)"
    },
    {
        "num": 98,
        "title": "Regulatory and Operational Strategies for Pension Managers and Executives",
        "category": "Pension Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Middle level and Senior Management Staff",
        "schedule": "May 11–15 (Ilorin), Aug 10–14 (Abuja), Oct 19–23 (Lagos)"
    },
    {
        "num": 99,
        "title": "Workshop on Office Management and Administrative Skills",
        "category": "Pension Management",
        "fee": 390000,
        "currency": "NGN",
        "target": "Middle and Senior Level Staff",
        "schedule": "July 13–17 (Abuja), Sept 7–11 (Ilorin), Nov 30–Dec 4 (Lagos)"
    },

    # 100-113 SELECTED SPECIAL TRAINING PROGRAMME
    {
        "num": 100,
        "title": "Communication / Presentations and Public Relations Skills",
        "category": "Special Executive Training",
        "fee": 400000,
        "currency": "NGN",
        "target": "Middle and Senior Level Staff",
        "schedule": "May 4–8 (Abuja), Aug 17–21 (Lagos)"
    },
    {
        "num": 101,
        "title": "Advanced Public Speaking and Presentation Skills",
        "category": "Special Executive Training",
        "fee": 390000,
        "currency": "NGN",
        "target": "Protocols, EAs & PAs",
        "schedule": "July 6–10 (Ilorin), Oct 12–16 (Lagos)"
    },
    {
        "num": 102,
        "title": "Enhancing Office Etiquette For Improved Productivity",
        "category": "Special Executive Training",
        "fee": 390000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "Aug 10–14 (Ilorin), Nov 23–27 (Lagos)"
    },
    {
        "num": 103,
        "title": "Ethical Standards and Organisational Development in the Public Service",
        "category": "Special Executive Training",
        "fee": 400000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "Aug 24–28 (Abuja), Oct 12–16 (Ilorin), Nov 30–Dec 4 (Lagos)"
    },
    {
        "num": 104,
        "title": "Next Generation Digital Strategies and ICT Applications",
        "category": "Special Executive Training",
        "fee": 450000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "July 6–10 (Ilorin), Aug 24–28 (Abuja), Oct 12–16 (Ilorin), Nov 30–Dec 4 (Lagos)"
    },
    {
        "num": 105,
        "title": "Project Management Essentials: Prospects and Challenges",
        "category": "Special Executive Training",
        "fee": 450000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "July 6–10 (Ilorin), Sept 21–25 (Abuja), Oct 12–16 (Lagos), Dec 7–11 (Ilorin)"
    },
    {
        "num": 106,
        "title": "Monitoring and Impact Evaluation Workshop",
        "category": "Special Executive Training",
        "fee": 450000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "Aug 24–28 (Abuja), Oct 12–16 (Ilorin), Nov 30–Dec 4 (Lagos)"
    },
    {
        "num": 107,
        "title": "Procurement and Vendor Management Skills Workshop",
        "category": "Special Executive Training",
        "fee": 450000,
        "currency": "NGN",
        "target": "Relevant Staff",
        "schedule": "June 15–19 (Abuja), Sept 14–18 (Ilorin)"
    },
    {
        "num": 108,
        "title": "Resolving Contractual Claims and Disputes",
        "category": "Special Executive Training",
        "fee": 450000,
        "currency": "NGN",
        "target": "Relevant Staff",
        "schedule": "June 15–19 (Abuja), Sept 14–18 (Ilorin)"
    },
    {
        "num": 109,
        "title": "Basic Data Analytics for Business and Financial Analysts",
        "category": "Special Executive Training",
        "fee": 450000,
        "currency": "NGN",
        "target": "Relevant Staff",
        "schedule": "July 27–31 (Abuja), Oct 19–23 (Lagos), Dec 7–11 (Abuja)"
    },
    {
        "num": 110,
        "title": "Software Disaster and Contingency Planning Workshop",
        "category": "Special Executive Training",
        "fee": 450000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "Nov 30–Dec 4 (Keffi), Dec 7–11 (Abuja & Lagos)"
    },
    {
        "num": 111,
        "title": "Organizational Design & Development",
        "category": "Special Executive Training",
        "fee": 450000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "July 13–17 (Abuja), Oct 12–16 (Lagos), Nov 2–6 (Keffi), Dec 7–11 (Ilorin)"
    },
    {
        "num": 112,
        "title": "Delivering Value through People in the Public and Private Sectors",
        "category": "Special Executive Training",
        "fee": 450000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "June 22–26 (Abuja), Sept 7–11 (Lagos), Nov 9–13 (Ilorin), Dec 7–11 (Lagos)"
    },
    {
        "num": 113,
        "title": "Introductory Data Analytics for Pension Administrators",
        "category": "Special Executive Training",
        "fee": 450000,
        "currency": "NGN",
        "target": "All Staff",
        "schedule": "June 15–19 (Abuja), Sept 14–18 (Ilorin), Nov 16–20 (Abuja), Dec 7–11 (Lagos)"
    }
]

foreign_raw = [
    # KIGALI - RWANDA (8) - $4,800 USD
    {
        "num": 1,
        "destination": "Kigali",
        "title": "Managing Service Quality and Customer Satisfaction in the Public and Private Sector",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "USD",
        "target": "Middle/Senior Management",
        "schedule": "Aug 3–7, Nov 9–13",
        "duration": "1 Week"
    },
    {
        "num": 2,
        "destination": "Kigali",
        "title": "Capacity Building Workshop on ICT Literacy and Security Awareness",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "USD",
        "target": "All Staff",
        "schedule": "June 22–26, Oct 12–16",
        "duration": "1 Week"
    },
    {
        "num": 3,
        "destination": "Kigali",
        "title": "Business Process Management Strategies in Public and Private Sectors",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "USD",
        "target": "Middle/Senior Management",
        "schedule": "Sept 7–11",
        "duration": "1 Week"
    },
    {
        "num": 4,
        "destination": "Kigali",
        "title": "Ethical Standards and Organisational Development in the Public Service and the Private Sector",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "USD",
        "target": "Middle/Senior Management",
        "schedule": "Aug 10–14, Nov 30–Dec 4",
        "duration": "1 Week"
    },
    {
        "num": 5,
        "destination": "Kigali",
        "title": "Customer Relationship Management and Retention",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "USD",
        "target": "All Staff",
        "schedule": "Aug 10–14, Oct 20–24",
        "duration": "1 Week"
    },
    {
        "num": 6,
        "destination": "Kigali",
        "title": "Regulatory Compliance Monitoring and Enforcement in Telecom, Power, Pension and Basic Sectors of the Economy",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "USD",
        "target": "All Staff",
        "schedule": "Aug 25–29, Oct 19–23, Nov 23–27",
        "duration": "1 Week"
    },
    {
        "num": 7,
        "destination": "Kigali",
        "title": "Next Generation Digital Strategies and ICT Applications for Improved Productivity in the Work Place",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "USD",
        "target": "All Staff",
        "schedule": "Aug 24–28, Nov 16–20",
        "duration": "1 Week"
    },
    {
        "num": 8,
        "destination": "Kigali",
        "title": "Regulatory and Operational Strategies for Utility Managers and Regulators",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "USD",
        "target": "All Staff",
        "schedule": "July 20–24, Oct 5–9",
        "duration": "1 Week"
    },

    # DUBAI - UAE (5) - $4,800 USD
    {
        "num": 1,
        "destination": "Dubai",
        "title": "Developing Management Skills For Administrators, SAs, PAs and Secretaries",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "USD",
        "target": "Middle/Senior Management",
        "schedule": "July 20–24, Nov 16–20",
        "duration": "1 Week"
    },
    {
        "num": 2,
        "destination": "Dubai",
        "title": "Modern Secretarial Administration Techniques in the Computerisation Era",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "USD",
        "target": "Secretaries, PAs, EAs",
        "schedule": "July 20–24, Nov 16–20",
        "duration": "1 Week"
    },
    {
        "num": 3,
        "destination": "Dubai",
        "title": "Next Generation Challenges & Opportunities for Telecom Other Utility Managers",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "USD",
        "target": "Relevant Staff",
        "schedule": "Sept 7–11, Oct 12–16",
        "duration": "1 Week"
    },
    {
        "num": 4,
        "destination": "Dubai",
        "title": "Leadership and Management Innovation For Organisational Development Using ICT",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "USD",
        "target": "Middle/Senior Management",
        "schedule": "Aug 24–28, Oct 12–16",
        "duration": "1 Week"
    },
    {
        "num": 5,
        "destination": "Dubai",
        "title": "Interpersonal Skills For Effective Communication and Confidence Building",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "USD",
        "target": "Middle/Senior Management",
        "schedule": "Sept 21–25, Nov 30–Dec 4",
        "duration": "1 Week"
    },

    # LONDON - UK (4) - £4,800 GBP
    {
        "num": 1,
        "destination": "London",
        "title": "Building Capacity For Executives and Top Management Utility Regulators",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "GBP",
        "target": "Middle/Senior Management",
        "schedule": "July 6–10",
        "duration": "1 Week"
    },
    {
        "num": 2,
        "destination": "London",
        "title": "Next Generation Challenges & Opportunities for Telecom Senior Executives",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "GBP",
        "target": "Middle/Senior Management",
        "schedule": "Aug 17–21",
        "duration": "1 Week"
    },
    {
        "num": 3,
        "destination": "London",
        "title": "Capacity Building Workshop on ICT Literacy and Security Awareness",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "GBP",
        "target": "Middle/Senior Management",
        "schedule": "Sept 21–25",
        "duration": "1 Week"
    },
    {
        "num": 4,
        "destination": "London",
        "title": "Infusing Knowledge Management in Public Service and Private Sector",
        "category": "Foreign Executive Training",
        "fee": 4800,
        "currency": "GBP",
        "target": "Middle/Senior Management",
        "schedule": "Oct 19–23",
        "duration": "1 Week"
    },

    # HOUSTON, TEXAS - USA (5) - $5,000 - $9,500 USD
    {
        "num": 1,
        "destination": "Houston",
        "title": "Capacity Building Workshop on ICT Literacy, New Innovations and Security Awareness",
        "category": "Foreign Executive Training",
        "fee": 5000,
        "currency": "USD",
        "target": "Middle/Senior Management",
        "schedule": "June 22–26",
        "duration": "1 Week"
    },
    {
        "num": 2,
        "destination": "Houston",
        "title": "Strategies for Managing Emerging Concepts of Smart Cities Big Data, AI, EI and 5G: Prospects and Challenges",
        "category": "Foreign Executive Training",
        "fee": 5000,
        "currency": "USD",
        "target": "Middle/Senior Management",
        "schedule": "July 20–24",
        "duration": "1 Week"
    },
    {
        "num": 3,
        "destination": "Houston",
        "title": "Infusing Knowledge Management in Public Service and Private Sector For Improved Productivity",
        "category": "Foreign Executive Training",
        "fee": 5000,
        "feeSecondary": 9500,
        "feeNotes": "$5,000 USD (1wk) / $9,500 USD (2wks)",
        "currency": "USD",
        "target": "Middle/Senior Management",
        "schedule": "Aug 10–14 (1wk) / Aug 10–21 (2wks)",
        "duration": "1–2 Weeks"
    },
    {
        "num": 4,
        "destination": "Houston",
        "title": "Next Generation Challenges & Opportunities for Telecom & Other Utilities Regulatory Managers",
        "category": "Foreign Executive Training",
        "fee": 5000,
        "feeSecondary": 9500,
        "feeNotes": "$5,000 USD (1wk) / $9,500 USD (2wks)",
        "currency": "USD",
        "target": "Middle/Senior Management",
        "schedule": "Oct 12–16 (1wk) / Oct 12–23 (2wks)",
        "duration": "1–2 Weeks"
    },
    {
        "num": 5,
        "destination": "Houston",
        "title": "Capacity Building Workshop on ICT Literacy and Security Awareness",
        "category": "Foreign Executive Training",
        "fee": 9500,
        "feeNotes": "$9,500 USD",
        "currency": "USD",
        "target": "Middle/Senior Management",
        "schedule": "Nov 9–13 (1wk) / Nov 9–20 (2wks)",
        "duration": "1–2 Weeks"
    }
]

print(f"Local programmes count: {len(local_raw)}")
print(f"Foreign programmes count: {len(foreign_raw)}")
print(f"Total count: {len(local_raw) + len(foreign_raw)}")

kigali_count = len([x for x in foreign_raw if x['destination'] == 'Kigali'])
dubai_count = len([x for x in foreign_raw if x['destination'] == 'Dubai'])
london_count = len([x for x in foreign_raw if x['destination'] == 'London'])
houston_count = len([x for x in foreign_raw if x['destination'] == 'Houston'])

print(f"Kigali: {kigali_count}, Dubai: {dubai_count}, London: {london_count}, Houston: {houston_count}")
