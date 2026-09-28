Case Study 1: Automated Surgical Inventory & Consumption Tracking System
Client/Context: Unidad Bariátrica Maracay (Bariatric Surgery Clinic)
Role: Internal Tools Developer
Tech Stack: Google Apps Script (JavaScript), Google Sheets (as an agile DB), Batch Data Processing.

1. The Problem (Situación y Tarea)
The clinic was struggling with the manual tracking of surgical supplies and medication consumption. Multiple users (nurses, administration) were updating records inefficiently, leading to a lack of real-time traceability, stock discrepancies, and bottlenecks in administrative workflows after surgeries. They needed a centralized, multi-user system to track exactly what was consumed in the operating room and automatically update master inventories without heavy legacy software.

2. The Solution (Acción Técnica)
Instead of deploying an oversized standard ERP, I architected a custom, lightweight multi-user tracking system built entirely within the Google Workspace ecosystem to minimize friction for the non-technical staff.

Database & Interface Design: Engineered a structured relational database model using Google Sheets, separating master inventory catalogs, live consumption inputs, and historical logs.

Workflow Automation: Wrote custom Google Apps Script functions to handle complex backend logic. This included automated stock validation before deductions, batch data processing to handle high-volume inputs after major surgeries, and concurrent user management to prevent data overwriting.

Access Control: Implemented tailored view/edit permissions so clinical staff could only input consumption data, while administrators retained control over the master stock.

3. The Impact (Resultados)
Eliminated manual stock-taking errors and established 100% real-time traceability of surgical supplies.

Drastically reduced the administrative time spent post-surgery by automating the deduction of used materials from the master inventory.

Delivered a highly adopted internal tool because it lived within
