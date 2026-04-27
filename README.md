Bill Reminder App
A full-stack web application that allows users to track bills and receive automated email reminders before
due dates. The system collects user input, stores data, and runs scheduled background processes to notify
users of upcoming payments.

Overview
This application enables users to add bill details such as name, due date, and email, store that data, and
automatically trigger reminders before the due date. It combines a frontend interface, backend API,
database, and automation into one system.

Features
* Add and manage bill details.
* Store data persistently
* Automated reminder system using scheduled tasks
* Email notifications for upcoming bills
* Client-side storage using localStorage

Tech Stack
User Interface → API (Express) → Database (PostgreSQL) → Background Job (Cron) → Email Service
* The frontend collects and sends data to the backend
* The backend stores data in the database
* A scheduled task checks for upcoming due dates
* Emails are sent automatically when conditions are met

Core Functionality
Users submit bill details through a form. The data is stored locally and in the database. A background
process runs periodically to check if any bills are due soon, and if so, sends an email reminder to the user.

Purpose
This project demonstrates the ability to build and integrate a complete system involving frontend
development, backend APIs, database management, automation, and external service integration.
