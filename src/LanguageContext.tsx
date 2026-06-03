import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'te' | 'hi';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {}, // English falls back to the key itself
  te: {
    // Top banner
    "Home": "హోమ్",
    "Features": "ఫీచర్లు",
    "Courses": "కోర్సులు",
    "Portals": "పోర్టల్స్",
    "Metrics": "మెట్రిక్స్",
    "Contact": "సంప్రదించండి",
    "Get in Touch": "సంప్రదించండి",
    "Book Appointment": "అపాయింట్‌మెంట్ బుక్ చేయండి",
    "Send Message": "సందేశం పంపండి",
    "Phone": "ఫోన్",
    "Email": "ఈమెయిల్",
    "Phone Number": "ఫోన్ నంబర్",
    "Enter your mobile number": "మీ మొబైల్ నంబర్ నమోదు చేయండి",
    "Your message has been sent successfully! Our team will contact you shortly.": "మీ సందేశం విజయవంతంగా పంపబడింది! మా బృందం త్వరలోనే మిమ్మల్ని సంప్రదిస్తుంది.",
    "Your call appointment is booked! Confirmation email has been sent.": "మీ కాల్ అపాయింట్‌మెంట్ బుక్ చేయబడింది! నిర్ధారణ ఈమెయిల్ పంపబడింది.",
    "Sign In": "సైన్ ఇన్",
    "Sign Out": "సైన్ అవుట్",
    "Get Started": "ప్రారంభించండి",
    "Academic CRM": "విద్యా CRM",
    "Unified Management Ecosystem v2.0 is Live": "ఏకీకృత నిర్వహణ పర్యావరణ వ్యవస్థ v2.0 ప్రత్యక్ష ప్రసారంలో ఉంది",
    "Empowering Education through": "ద్వారా విద్యను బలోపేతం చేయడం",
    "Intelligent Management crm": "తెలివైన నిర్వహణ CRM",
    "Connecting Administrators, Tutors, Parents, and Students into a cohesive learning workspace. View reports, compile grades, clear billing invoices, and message teachers in real-time.": "నిర్వాహకులు, ట్యూటర్లు, తల్లిదండ్రులు మరియు విద్యార్థులను ఒక సమన్వయ అభ్యాస కార్యక్షేత్రంలోకి అనుసంధానించడం. నివేదికలను వీక్షించండి, గ్రేడ్‌లను క్రోడీకరించండి, బిల్లింగ్ ఇన్‌వాయిస్‌లను క్లియర్ చేయండి మరియు నిజ సమయంలో ఉపాధ్యాయులకు సందేశం పంపండి.",
    "Start Registration Stepper": "రిజిస్ట్రేషన్ ప్రారంభించండి",
    "Access Multi-Role Dashboards": "మల్టీ-రోల్ డాష్‌బోర్డులను యాక్సెస్ చేయండి",

    // Sub portals
    "Explore Our Live Sub-Portals": "మా లైవ్ సబ్-పోర్టల్‌లను అన్వేషించండి",
    "EduManage CRM dynamically routes layouts based on authorized account parameters. Select a client preview node to try immediately.": "EduManage CRM అధీకృత ఖాతా పారామితుల ఆధారంగా లేఅవుట్‌లను డైనమిక్‌గా రూట్ చేస్తుంది. వెంటనే ప్రయత్నించడానికి క్లయింట్ ప్రివ్యూ నోడ్‌ను ఎంచుకోండి.",
    "Administrative CRM": "పరిపాలనా CRM",
    "Manage standard student directory databases, track fee metrics, monitor real-time security audits and logs, & enroll students securely.": "ప్రామాణిక విద్యార్థి డైరెక్టరీ డేటాబేస్‌లను నిర్వహించండి, ఫీజుల కొలమానాలను ట్రాక్ చేయండి, నిజ-సమయ భద్రతా ఆడిట్లు మరియు లాగ్‌లను పర్యవేక్షించండి & విద్యార్థులను సురక్షితంగా నమోదు చేయండి.",
    "Quick Preview CRM Panel": "శీఘ్ర ప్రివ్యూ CRM ప్యానెల్",
    "Tutor Workspace": "ట్యూటర్ వర్క్‌స్పేస్",
    "Log class attendances quickly, record progress indicators, add grades to historic exams, & edit curriculum trackers with zero delay.": "క్లాస్ హాజరును త్వరగా నమోదు చేయండి, పురోగతి సూచికలను రికార్డ్ చేయండి, పరీక్షలకు గ్రేడ్‌లను జోడించండి & ఆలస్యం లేకుండా పాఠ్యప్రణాళికను సవరించండి.",
    "Launch Tutor Control": "ట్యూటర్ నియంత్రణను ప్రారంభించండి",
    "Parent Portal": "పేరెంట్ పోర్టల్",
    "Track child metrics (attendance gauges, homework grades), review notifications transcripts, pay bills & invoices via payment gateways.": "పిల్లల కొలమానాలను ట్రాక్ చేయండి (హాజరు, హోంవర్క్ గ్రేడ్‌లు), నోటిఫికేషన్ ట్రాన్స్‌క్రిప్ట్‌లను సమీక్షించండి, చెల్లింపు గేట్‌వేల ద్వారా బిల్లులు & ఇన్‌వాయిస్‌లను చెల్లించండి.",
    "Configure Parent Linkage": "పేరెంట్ లింకేజ్ కాన్ఫిగర్ చేయండి",
    "Student Portal": "స్టూడెంట్ పోర్టల్",
    "View customized curricula, monitor active homework completions, check class schedules, and simulate communication using active support channels.": "అనుకూలీకరించిన పాఠ్యప్రణాళికను వీక్షించండి, హోంవర్క్ పూర్తి చేయడాన్ని పర్యవేక్షించండి, క్లాస్ షెడ్యూల్‌లను తనిఖీ చేయండి మరియు మద్దతు ఛానెల్‌లను ఉపయోగించి కమ్యూనికేషన్‌ను అనుకరించండి.",
    "Access Learning Board": "అభ్యాస బోర్డ్‌ను యాక్సెస్ చేయండి",

    // Courses Section
    "Curated Syllabus Programs": "క్యూరేటెడ్ సిలబస్ ప్రోగ్రామ్‌లు",
    "Academic Courses Provided": "అందించే విద్యా కోర్సులు",
    "Discover our advanced, tutor-led honors courses. Click to start learning or view course specifics instantly.": "మా అధునాతన, ట్యూటర్ నేతృత్వంలోని ఆనర్స్ కోర్సులను కనుగొనండి. నేర్చుకోవడం ప్రారంభించడానికి లేదా కోర్సు వివరాలను తక్షణమే వీక్షించడానికి క్లిక్ చేయండి.",
    "Enroll Now": "ఇప్పుడే చేరండి",
    "Instructed by:": "బోధించినవారు:",

    // Features Section
    "CRM Core Capabilities": "CRM ప్రధాన సామర్థ్యాలు",
    "Engineered for Academic Precision and Operations": "విద్యాపరమైన ఖచ్చితత్వం మరియు కార్యకలాపాల కోసం రూపొందించబడింది",
    "Comprehensive Accounting": "సమగ్ర అకౌంటింగ్",
    "Seamless Payment Linkages for Outstanding Dues": "బకాయిల కోసం అతుకులు లేని చెల్లింపు లింకేజీలు",
    "Say goodbye to complicated tuition billing. Administrators issue itemized billing ledgers while parents receive real-time notifications to complete secure payment gateways instantly inside the dashboard.": "సంక్లిష్టమైన ట్యూషన్ బిల్లింగ్‌కు స్వస్తి చెప్పండి. నిర్వాహకులు ఐటమైజ్డ్ బిల్లింగ్ లెడ్జర్‌లను జారీ చేస్తారు మరియు తల్లిదండ్రులు డాష్‌బోర్డ్ లోపల సురక్షితమైన చెల్లింపు గేట్‌వేలను తక్షణమే పూర్తి చేయడానికి నిజ-సమయ నోటిఫికేషన్‌లను అందుకుంటారు.",
    "Itemized Billing": "ఐటమైజ్డ్ బిల్లింగ్",
    "Automated invoices": "స్వయంచాలక ఇన్‌వాయిస్‌లు",
    "Direct Remittance": "प्रत्यक्ष బదిలీ",
    "Real-time status transitions": "నిజ-సమయ స్థితి మార్పులు",
    "Declined Card Logs": "తిరస్కరించబడిన కార్డ్ లాగ్‌లు",
    "Admin audit trail": "అడ్మిన్ ఆడిట్ ట్రైల్",
    "Advanced Visualization": "అధునాతన విజువలైజేషన్",
    "Interactive Growth Metrics": "ఇంటరాక్టివ్ వృద్ధి కొలమానాలు",
    "Generate responsive enrollment visualizations dynamically. Admins can view seasonal registration statistics and budget statuses immediately under animated, vector SVG graphs.": "డైనమిక్‌గా ప్రతిస్పందించే నమోదు విజువలైజేషన్‌లను రూపొందించండి. నిర్వాహకులు యానిమేటెడ్, వెక్టర్ SVG గ్రాఫ్‌ల ద్వారా తక్షణమే రిజిస్ట్రేషన్ గణాంకాలు మరియు బడ్జెట్ స్థితులను వీక్షించవచ్చు.",

    // Stats Section
    "Enrolled Students": "నమోదైన విద్యార్థులు",
    "Attendance Rate": "హాజరు రేటు",
    "Certified Educators": "ధృవీకరించబడిన అధ్యాపకులు",
    "Parent Link Verification": "తల్లిదండ్రుల లింక్ ధృవీకరణ",

    // Footer
    "EduManage Academic Group LTD": "ఎడ్యుమేనేజ్ అకాడెమిక్ గ్రూప్ లిమిటెడ్",
    "EduManage CRM. Built for Next-Generation Learning Organizations. All rights reserved.": "ఎడ్యుమేనేజ్ CRM. తదుపరి తరం అభ్యాస సంస్థల కోసం నిర్మించబడింది. అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.",

    // Login Screen
    "Secure Portal Authorization": "సురక్షిత పోర్టల్ అధికారం",
    "Login Identifier": "లాగిన్ ఐడెంటిఫైయర్",
    "Access Token Key": "యాక్సెస్ టోకెన్ కీ",
    "Access Portal": "పోర్టల్‌ను యాక్సెస్ చేయండి",
    "Back": "వెనుకకు",
    "New to our campus?": "మా క్యాంపస్‌కు కొత్తా?",
    "Run Registration Stepper": "రిజిస్ట్రేషన్ ప్రారంభించండి",
    "Back to Home": "హోమ్‌కు తిరిగి వెళ్ళండి",
    "Administrative Control Panel": "పరిపాలనా నియంత్రణ ప్యానెల్",
    "Access audit registries, students list databases, and revenue trends.": "ఆడిట్ రిజిస్ట్రీలు, విద్యార్థుల జాబితా డేటాబేస్‌లు మరియు రాబడి ధోరణులను యాక్సెస్ చేయండి.",
    "Tutor Workspace Portal": "ట్యూటర్ వర్క్‌స్పేస్ పోర్టల్",
    "Mark attendances, review course timetables, and compile homework grades.": "హాజరును గుర్తించండి, కోర్సు టైమ్‌టేబుల్‌లను సమీక్షించండి మరియు హోంవర్క్ గ్రేడ్‌లను క్రోడీకరించండి.",
    "Parent Linkage Portal": "పేరెంట్ లింకేజ్ పోర్టల్",
    "Review Helena Thorne linking Marcus, check unpaid fees, and monitor announcements.": "హెలెనా థోర్న్ మార్కస్‌ను లింక్ చేయడాన్ని సమీక్షించండి, చెల్లించని ఫీజులను తనిఖీ చేయండి మరియు ప్రకటనలను పర్యవేక్షించండి.",
    "Student Learning CRM": "స్టూడెంట్ లెర్నింగ్ CRM",
    "Track Marcus Thorne active learning curves, complete assignments, and query tools.": "మార్కస్ థోర్న్ క్రియాశీల అభ్యాస వక్రతలను ట్రాక్ చేయండి, అసైన్‌మెంట్‌లను పూర్తి చేయండి మరియు సాధనాలను ప్రశ్నించండి.",
    "Please provide both administrative username/email and access key.": "దయచేసి అడ్మిన్ వినియోగదారు పేరు/ఈమెయిల్ మరియు యాక్సెస్ కీ రెండింటినీ అందించండి.",

    // Register Stepper
    "Step 1 of 3 • Credential Type": "3 లో 1వ దశ • ఆధారాల రకం",
    "Step 2 of 3 • Profile Registry": "3 లో 2వ దశ • ప్రొఫైల్ రిజిస్ట్రీ",
    "Step 3 of 3 • Validation Links": "3 లో 3వ దశ • ధృవీకరణ లింకులు",
    "Select Your Account Type": "మీ ఖాతా రకాన్ని ఎంచుకోండి",
    "Choose between Student or Parent role. EduManage delivers tailored boards based on selection parameters.": "విద్యార్థి లేదా తల్లిదండ్రుల పాత్రల మధ్య ఎంచుకోండి. EduManage ఎంపిక పారామితుల ఆధారంగా అనుకూలమైన బోర్డులను అందిస్తుంది.",
    "Student Portal Profile": "విద్యార్థి పోర్టల్ ప్రొఫైల్",
    "Complete assignment lists, query support tools directly, and track exam updates.": "అసైన్‌మెంట్ జాబితాలను పూర్తి చేయండి, సహాయక సాధనాలను నేరుగా ప్రశ్నించండి మరియు పరీక్ష నవీకరణలను ట్రాక్ చేయండి.",
    "Parent Guardian Link": "పేరెంట్ గార్డియన్ లింక్",
    "Monitor learning attendance metrics, verify unpaid fee balances, and review reports.": "అభ్యాస హాజరు కొలమానాలను పర్యవేక్షించండి, చెల్లించని ఫీజు బ్యాలెన్స్‌లను ధృవీకరించండి మరియు నివేదికలను సమీక్షించండి.",
    "Continue Profile Creation": "ప్రొఫైల్ సృష్టిని కొనసాగించండి",
    "Registry Profile Details": "రిజిస్ట్రీ ప్రొఫైల్ వివరాలు",
    "Provide legal identification and access keys for account verification checks.": "ఖాతా ధృవీకరణ తనిఖీల కోసం చట్టపరమైన గుర్తింపు మరియు యాక్సెస్ కీలను అందించండి.",
    "First Name": "మొదటి పేరు",
    "Last Name": "ఇంటి పేరు",
    "Contact Email Address": "ఈమెయిల్ చిరునామా",
    "Primary Phone Number": "ప్రాథమిక ఫోన్ నంబర్",
    "Grade Standard": "గ్రేడ్ ప్రమాణం",
    "Parent Mobile Contact (Optional)": "తల్లిదండ్రుల మొబైల్ నంబర్ (ఐచ్ఛికం)",
    "Learning Motivation Target": "అభ్యాస ప్రేరణ లక్ష్యం",
    "Secure Control Key Password": "సురక్షిత నియంత్రణ కీ పాస్‌వర్డ్",
    "Next: Validation Links": "తదుపరి: ధృవీకరణ లింకులు",
    "Finalize Enrollment": "నమోదును ఖరారు చేయండి",
    "Remembered login details?": "లాగిన్ వివరాలు గుర్తున్నాయా?",
    "Sign in as Demo User Instantly": "డెమో యూజర్‌గా తక్షణమే సైన్ ఇన్ చేయండి",
    "Linkage Policy Acknowledgement": "లింకేజ్ విధానం అంగీకారం",

    // Admin Dashboard
    "Admin Command Node": "అడ్మిన్ కమాండ్ నోడ్",
    "Active Students": "క్రియాశీల విద్యార్థులు",
    "Educators": "విద్యావేత్తలు",
    "Fees Receivable": "స్వీకరించవలసిన ఫీజులు",
    "Audit Records": "ఆడిట్ రికార్డులు",
    "Enrollment Growth Trend": "నమోదు వృద్ధి ధోరణి",
    "Budget Ledger Share": "బడ్జెట్ లెడ్జర్ వాటా",
    "Student Enrollment Directory": "విద్యార్థుల నమోదు డైరెక్టరీ",
    "Query name, grade, standard...": "పేరు, గ్రేడ్, ప్రమాణం వెతకండి...",
    "Enroll Student": "విద్యార్థిని నమోదు చేయండి",
    "System Security Activity Audits": "సిస్టమ్ భద్రతా కార్యాచరణ ఆడిట్లు",
    "Certified Educators On-Duty": "విధిలో ఉన్న ధృవీకృత అధ్యాపకులు",
    "Successfully enrolled": "సఫలవంతంగా నమోదు చేయబడింది",

    // Student Dashboard
    "Academic Portal": "విద్యా పోర్టల్",
    "GPA Trend": "GPA ధోరణి",
    "Welcome back, Marcus!": "తిరిగి స్వాగతం, మార్కస్!",
    "Track your curriculum progress metrics, check scheduled midterm locations, or chat with assigned tutor personnel in real-time.": "మీ పాఠ్యప్రణాళిక పురోగతి కొలమానాలను ట్రాక్ చేయండి, షెడ్యూల్ చేసిన మిడ్‌టర్మ్ స్థానాలను తనిఖీ చేయండి లేదా కేటాయించిన ట్యూటర్ సిబ్బందితో నిజ సమయంలో చాట్ చేయండి.",
    "Exams Timeline": "పరీక్షల కాలక్రమం",
    "Assessments Log": "మూల్యాంకనాల లాగ్",
    "Messaging Station": "సందేశ కేంద్రం",
    "Student Hub Academic Resources": "విద్యార్థి కేంద్రం విద్యా వనరులు",

    // Parent Dashboard
    "Guardian Link Account": "గార్డియన్ లింక్ ఖాతా",
    "Student Progress Directory: Marcus Thorne": "విద్యార్థి ప్రగతి డైరెక్టరీ: మార్కస్ థోర్న్",
    "Outstanding Balance Due": "చెల్లించవలసిన మొత్తం బకాయి",
    "Homework Completion": "హోంవర్క్ పూర్తి చేయడం",
    "Average Course Grades": "సగటు కోర్సు గ్రేడ్‌లు",
    "Itemized Tuition Billing & Fees Ledger": "ట్యూషన్ బిల్లింగ్ & ఫీజుల లెడ్జర్",
    "Pay Now": "ఇప్పుడే చెల్లించండి",
    "Advisory Board Bulletin": "సలహా బోర్డు బులెటిన్",
    "Secure Payment Gateway": "సురక్షిత చెల్లింపు గేట్‌వే",
    "Confirm & Remit Outstanding Dues": "బకాయిలను ధృవీకరించి చెల్లించండి",

    // Tutor Dashboard
    "Academic Command": "విద్యా కమాండ్",
    "Daily Command Space": "రోజువారీ కమాండ్ స్థలం",
    "Schedule seminar session": "సెమినార్ సెషన్‌ను షెడ్యూల్ చేయండి",
    "Mark Today's Classroom Attendance Roll": "నేటి తరగతి గది హాజరును నమోదు చేయండి",
    "Evaluate Assignment Draft": "అసైన్‌మెంట్ డ్రాఫ్ట్‌ను మూల్యాంకనం చేయండి",
    "Compile & Log Evaluation": "మూల్యాంకనాన్ని క్రోడీకరించి నమోదు చేయండి",
    "Lecture Timetable": "ఉపన్యాస కాలపట్టిక",

    // AI Chatbox
    "Hello! I am your EduManage Support Assistant. Select a quick question below or ask me about attendance, fees, messaging, grades, or study materials.": "హలో! నేను మీ EduManage సహాయక అసిస్టెంట్‌ని. క్రింది శీఘ్ర ప్రశ్నను ఎంచుకోండి లేదా హాజరు, ఫీజులు, సందేశాలు, గ్రేడ్‌లు లేదా అధ్యయన సామగ్రి గురించి నన్ను అడగండి.",
    "📅 How to check attendance?": "📅 హాజరును ఎలా తనిఖీ చేయాలి?",
    "You can view the Attendance Calendar card on the Parent Dashboard, or under the 'Attendance Calendar' tab on the Student Dashboard. Present days are green, absent days (May 8 and May 20) are red, and weekends are grey.": "మీరు పేరెంట్ డాష్‌బోర్డ్‌లో హాజరు క్యాలెండర్ కార్డ్‌ని చూడవచ్చు లేదా స్టూడెంట్ డాష్‌బోర్డ్‌లోని 'హాజరు క్యాలెండర్' ట్యాబ్ కింద చూడవచ్చు. హాజరైన రోజులు ఆకుపచ్చగా, లేని రోజులు (మే 8 మరియు మే 20) ఎరుపు రంగులో మరియు వారాంతాలు బూడిద రంగులో ఉంటాయి.",
    "💳 How to pay tuition fees?": "💳 ట్యూషన్ ఫీజు ఎలా చెల్లించాలి?",
    "Navigate to the Tuition Billing Ledger on the Parent Dashboard. Click the 'Pay Now' button next to any pending/overdue item, enter your card details in the secure payment gateway modal, and confirm the transaction.": "పేరెంట్ డాష్‌బోర్డ్‌లోని ట్యూషన్ బిల్లింగ్ లెడ్జర్‌కి నావిగేట్ చేయండి. ఏదైనా పెండింగ్/గడువు ముగిసిన అంశం పక్కన ఉన్న 'ఇప్పుడే చెల్లించండి' బటన్‌ను క్లిక్ చేసి, సురక్షిత చెల్లింపు గేట్‌వే మోడల్‌లో మీ కార్డ్ వివరాలను నమోదు చేసి, లావాదేవీని ధృవీకరించండి.",
    "💬 How to contact my tutor?": "💬 నా ట్యూటర్‌ను ఎలా సంప్రదించాలి?",
    "Use the 'Messaging Station' on the Student Dashboard or the 'Direct Messages' tab on the Parent Dashboard. You can select your tutor from the dropdown menu and type a message to receive immediate simulated responses.": "స్టూడెంట్ డాష్‌బోర్డ్‌లోని 'సందేశ కేంద్రం' లేదా పేరెంట్ డాష్‌బోర్డ్‌లోని 'ప్రత్యక్ష సందేశాలు' ట్యాబ్‌ను ఉపయోగించండి. మీరు డ్రాప్‌డౌన్ మెను నుండి మీ ట్యూటర్‌ను ఎంచుకోవచ్చు మరియు తక్షణ ప్రతిస్పందనలను పొందడానికి సందేశాన్ని టైప్ చేయవచ్చు.",
    "📚 Where are study resources?": "📚 అధ్యయన వనరులు ఎక్కడ ఉన్నాయి?",
    "Academic materials and PDFs matching your registered courses are available under the 'Student Hub Academic Resources' section at the bottom of the Student Dashboard.": "మీరు నమోదు చేసుకున్న కోర్సులకు సరిపోయే విద్యా సామగ్రి మరియు PDFలు స్టూడెంట్ డాష్‌బోర్డ్ దిగువన ఉన్న 'విద్యార్థి కేంద్రం విద్యా వనరులు' విభాగంలో అందుబాటులో ఉన్నాయి.",
    "📝 How to view exam results?": "📝 పరీక్ష ఫలితాలను ఎలా వీక్షించాలి?",
    "Go to the Student Dashboard. Under the selector menu, check the 'Exams Timeline' tab for upcoming assessments, the 'Assessments Log' tab for instructor notes and marks, or 'Term Results' to download your final PDF report.": "స్టూడెంట్ డాష్‌బోర్డ్‌కి వెళ్లండి. సెలెక్టర్ మెను కింద, రాబోయే మూల్యాంకనాల కోసం 'పరీక్షల కాలక్రమం' ట్యాబ్, బోధకుని గమనికలు మరియు మార్కుల కోసం 'మూల్యాంకనాల లాగ్' ట్యాబ్ లేదా మీ తుది PDF నివేదికను డౌన్‌లోడ్ చేయడానికి 'టర్మ్ ఫలితాలు' తనిఖీ చేయండి.",
    "I am operating in offline mode. Please click one of the quick questions below, or try searching for keywords like 'attendance', 'fees', 'message', 'materials', or 'results'.": "నేను ఆఫ్‌లైన్ మోడ్‌లో పని చేస్తున్నాను. దయచేసి క్రింది శీఘ్ర ప్రశ్నలలో ఒకదానిపై క్లిక్ చేయండి లేదా 'హాజరు', 'ఫీజులు', 'సందేశం', 'సామగ్రి' లేదా 'ఫలితాలు' వంటి కీలక పదాల కోసం వెతకడానికి ప్రయత్నించండి.",
    "Assistant searching FAQ files...": "అసిస్టెంట్ తరచుగా అడిగే ప్రశ్నల ఫైల్‌లను వెతుకుతోంది...",
    "EduManage AI Support": "EduManage AI మద్దతు",
    "Offline Assistant": "ఆఫ్‌లైన్ అసిస్టెంట్",
    "Quick Questions": "శీఘ్ర ప్రశ్నలు",
    "Ask about attendance, fees, messaging...": "హాజరు, ఫీజులు, సందేశాల గురించి అడగండి..."
  },
  hi: {
    // Top banner
    "Home": "होम",
    "Features": "विशेषताएं",
    "Courses": "पाठ्यक्रम",
    "Portals": "पोर्टल",
    "Metrics": "आँकड़े",
    "Contact": "संपर्क",
    "Get in Touch": "संपर्क में रहें",
    "Book Appointment": "अपॉइंटमेंट बुक करें",
    "Send Message": "संदेश भेजें",
    "Phone": "फ़ोन",
    "Email": "ईमेल",
    "Phone Number": "फ़ोन नंबर",
    "Enter your mobile number": "अपना मोबाइल नंबर दर्ज करें",
    "Your message has been sent successfully! Our team will contact you shortly.": "आपका संदेश सफलतापूर्वक भेज दिया गया है! हमारी टीम जल्द ही आपसे संपर्क करेगी।",
    "Your call appointment is booked! Confirmation email has been sent.": "आपका कॉल अपॉइंटमेंट बुक हो गया है! पुष्टिकरण ईमेल भेज दिया गया है।",
    "Sign In": "साइन इन",
    "Sign Out": "साइन आउट",
    "Get Started": "शुरू करें",
    "Academic CRM": "शैक्षणिक सीआरएम",
    "Unified Management Ecosystem v2.0 is Live": "एकीकृत प्रबंधन पारिस्थितिकी तंत्र v2.0 लाइव है",
    "Empowering Education through": "के माध्यम से शिक्षा को सशक्त बनाना",
    "Intelligent Management crm": "इंटेलिजेंट मैनेजमेंट सीआरएम",
    "Connecting Administrators, Tutors, Parents, and Students into a cohesive learning workspace. View reports, compile grades, clear billing invoices, and message teachers in real-time.": "प्रशासकों, ट्यूटर्स, अभिभावकों और छात्रों को एक सामंजस्यपूर्ण शिक्षण कार्यक्षेत्र में जोड़ना। वास्तविक समय में रिपोर्ट देखें, ग्रेड संकलित करें, बिलिंग चालान साफ़ करें और शिक्षकों को संदेश भेजें।",
    "Start Registration Stepper": "पंजीकरण शुरू करें",
    "Access Multi-Role Dashboards": "मल्टी-रोल डैशबोर्ड एक्सेस करें",

    // Sub portals
    "Explore Our Live Sub-Portals": "हमारे लाइव सब-पोर्टल देखें",
    "EduManage CRM dynamically routes layouts based on authorized account parameters. Select a client preview node to try immediately.": "एडुमैनेज सीआरएम अधिकृत खाता मापदंडों के आधार पर लेआउट को गतिशील रूप से रूट करता है। तुरंत प्रयास करने के लिए क्लाइंट पूर्वावलोकन नोड का चयन करें।",
    "Administrative CRM": "प्रशासनिक सीआरएम",
    "Manage standard student directory databases, track fee metrics, monitor real-time security audits and logs, & enroll students securely.": "मानक छात्र निर्देशिका डेटाबेस प्रबंधित करें, शुल्क मेट्रिक्स ट्रैक करें, वास्तविक समय सुरक्षा ऑडिट और लॉग की निगरानी करें, और छात्रों को सुरक्षित रूप से नामांकित करें।",
    "Quick Preview CRM Panel": "त्वरित पूर्वावलोकन सीआरएम पैनल",
    "Tutor Workspace": "शिक्षक कार्यक्षेत्र",
    "Log class attendances quickly, record progress indicators, add grades to historic exams, & edit curriculum trackers with zero delay.": "कक्षा की उपस्थिति जल्दी दर्ज करें, प्रगति संकेतक रिकॉर्ड करें, ऐतिहासिक परीक्षाओं में ग्रेड जोड़ें, और बिना किसी देरी के पाठ्यक्रम ट्रैकर्स को संपादित करें।",
    "Launch Tutor Control": "शिक्षक नियंत्रण शुरू करें",
    "Parent Portal": "अभिभावक पोर्टल",
    "Track child metrics (attendance gauges, homework grades), review notifications transcripts, pay bills & invoices via payment gateways.": "बच्चे के मेट्रिक्स ट्रैक करें (उपस्थिति, होमवर्क ग्रेड), अधिसूचनाओं की समीक्षा करें, भुगतान गेटवे के माध्यम से बिल और चालान का भुगतान करें।",
    "Configure Parent Linkage": "अभिभावक लिंक कॉन्फ़िगर करें",
    "Student Portal": "छात्र पोर्टल",
    "View customized curricula, monitor active homework completions, check class schedules, and simulate communication using active support channels.": "अनुकूलित पाठ्यक्रम देखें, सक्रिय होमवर्क पूरा करने की निगरानी करें, कक्षा के कार्यक्रम की जांच करें, और सहायता चैनलों का उपयोग करके संचार का अनुकरण करें।",
    "Access Learning Board": "लर्निंग बोर्ड एक्सेस करें",

    // Courses Section
    "Curated Syllabus Programs": "क्यूरेटेड पाठ्यक्रम कार्यक्रम",
    "Academic Courses Provided": "प्रदान किए गए शैक्षणिक पाठ्यक्रम",
    "Discover our advanced, tutor-led honors courses. Click to start learning or view course specifics instantly.": "हमारे उन्नत, ट्यूटर-नेतृत्व वाले ऑनर्स पाठ्यक्रमों की खोज करें। सीखना शुरू करने या पाठ्यक्रम विवरण तुरंत देखने के लिए क्लिक करें।",
    "Enroll Now": "अभी नामांकन करें",
    "Instructed by:": "द्वारा निर्देशित:",

    // Features Section
    "CRM Core Capabilities": "सीआरएम मुख्य क्षमताएं",
    "Engineered for Academic Precision and Operations": "शैक्षणिक सटीकता और संचालन के लिए इंजीनियर किया गया",
    "Comprehensive Accounting": "व्यापक लेखांकन",
    "Seamless Payment Linkages for Outstanding Dues": "बकाया राशि के लिए निर्बाध भुगतान लिंक",
    "Say goodbye to complicated tuition billing. Administrators issue itemized billing ledgers while parents receive real-time notifications to complete secure payment gateways instantly inside the dashboard.": "जटिल ट्यूशन बिलिंग को अलविदा कहें। व्यवस्थापक विस्तृत बिलिंग बहीखाता जारी करते हैं जबकि माता-पिता डैशबोर्ड के अंदर सुरक्षित भुगतान गेटवे को तुरंत पूरा करने के लिए वास्तविक समय में सूचनाएं प्राप्त करते हैं।",
    "Itemized Billing": "मदवार बिलिंग",
    "Automated invoices": "स्वचालित चालान",
    "Direct Remittance": "सीधा प्रेषण",
    "Real-time status transitions": "वास्तविक समय स्थिति परिवर्तन",
    "Declined Card Logs": "अस्वीकृत कार्ड लॉग",
    "Admin audit trail": "व्यवस्थापक ऑडिट ट्रेल",
    "Advanced Visualization": "उन्नत विज़ुअलाइज़ेशन",
    "Interactive Growth Metrics": "इंटरैक्टिव विकास आँकड़े",
    "Generate responsive enrollment visualizations dynamically. Admins can view seasonal registration statistics and budget statuses immediately under animated, vector SVG graphs.": "गतिशील रूप से उत्तरदायी नामांकन विज़ुअलाइज़ेशन उत्पन्न करें। एडमिन एनिमेटेड, वेक्टर एसवीजी ग्राफ़ के तहत मौसमी पंजीकरण आंकड़े और बजट की स्थिति तुरंत देख सकते हैं।",

    // Stats Section
    "Enrolled Students": "नामांकित छात्र",
    "Attendance Rate": "उपस्थिति दर",
    "Certified Educators": "प्रमाणित शिक्षक",
    "Parent Link Verification": "अभिभावक लिंक सत्यापन",

    // Footer
    "EduManage Academic Group LTD": "एडुमैनेज एकेडमिक ग्रुप लिमिटेड",
    "EduManage CRM. Built for Next-Generation Learning Organizations. All rights reserved.": "एडुमैनेज सीआरएम। अगली पीढ़ी के शिक्षण संगठनों के लिए निर्मित। सभी अधिकार सुरक्षित।",

    // Login Screen
    "Secure Portal Authorization": "सुरक्षित पोर्टल प्राधिकरण",
    "Login Identifier": "लॉगिन पहचानकर्ता",
    "Access Token Key": "एक्सेस टोकन कुंजी",
    "Access Portal": "पोर्टल एक्सेस करें",
    "Back": "वापस",
    "New to our campus?": "हमारे परिसर में नए हैं?",
    "Run Registration Stepper": "पंजीकरण शुरू करें",
    "Back to Home": "होम पर वापस जाएं",
    "Administrative Control Panel": "प्रशासनिक नियंत्रण कक्ष",
    "Access audit registries, students list databases, and revenue trends.": "ऑडिट रजिस्ट्रियों, छात्रों की सूची डेटाबेस और राजस्व प्रवृत्तियों तक पहुंचें।",
    "Tutor Workspace Portal": "ट्यूटर कार्यक्षेत्र पोर्टल",
    "Mark attendances, review course timetables, and compile homework grades.": "उपस्थिति दर्ज करें, पाठ्यक्रम समय सारिणी की समीक्षा करें, और होमवर्क ग्रेड संकलित करें।",
    "Parent Linkage Portal": "अभिभावक लिंक पोर्टल",
    "Review Helena Thorne linking Marcus, check unpaid fees, and monitor announcements.": "हेलेना थॉर्न द्वारा मार्कस को लिंक करने की समीक्षा करें, भुगतान न की गई फीस की जांच करें और घोषणाओं की निगरानी करें।",
    "Student Learning CRM": "छात्र शिक्षण सीआरएम",
    "Track Marcus Thorne active learning curves, complete assignments, and query tools.": "मार्कस थॉर्न के सक्रिय शिक्षण वक्रों को ट्रैक करें, असाइनमेंट पूरा करें और टूल से पूछताछ करें।",
    "Please provide both administrative username/email and access key.": "कृपया प्रशासनिक उपयोगकर्ता नाम/ईमेल और एक्सेस कुंजी दोनों प्रदान करें।",

    // Register Stepper
    "Step 1 of 3 • Credential Type": "3 में से चरण 1 • क्रेडेंशियल प्रकार",
    "Step 2 of 3 • Profile Registry": "3 में से चरण 2 • प्रोफ़ाइल रजिस्ट्री",
    "Step 3 of 3 • Validation Links": "3 में से चरण 3 • सत्यापन लिंक",
    "Select Your Account Type": "अपने खाते का प्रकार चुनें",
    "Choose between Student or Parent role. EduManage delivers tailored boards based on selection parameters.": "छात्र या अभिभावक की भूमिका के बीच चयन करें। EduManage चयन मापदंडों के आधार पर अनुकूलित बोर्ड प्रदान करता है।",
    "Student Portal Profile": "छात्र पोर्टल प्रोफ़ाइल",
    "Complete assignment lists, query support tools directly, and track exam updates.": "असाइनमेंट सूचियों को पूरा करें, सीधे सहायता टूल से पूछताछ करें, और परीक्षा अपडेट ट्रैक करें।",
    "Parent Guardian Link": "अभिभावक संरक्षक लिंक",
    "Monitor learning attendance metrics, verify unpaid fee balances, and review reports.": "शिक्षण उपस्थिति मेट्रिक्स की निगरानी करें, भुगतान न किए गए शुल्क शेष को सत्यापित करें और रिपोर्ट की समीक्षा करें।",
    "Continue Profile Creation": "प्रोफ़ाइल निर्माण जारी रखें",
    "Registry Profile Details": "रजिस्ट्री प्रोफ़ाइल विवरण",
    "Provide legal identification and access keys for account verification checks.": "खाता सत्यापन जांच के लिए कानूनी पहचान और एक्सेस कुंजी प्रदान करें.",
    "First Name": "पहला नाम",
    "Last Name": "उपनाम",
    "Contact Email Address": "संपर्क ईमेल पता",
    "Primary Phone Number": "प्राथमिक फ़ोन नंबर",
    "Grade Standard": "ग्रेड मानक",
    "Parent Mobile Contact (Optional)": "अभिभावक मोबाइल संपर्क (वैकल्पिक)",
    "Learning Motivation Target": "सीखने की प्रेरणा का लक्ष्य",
    "Secure Control Key Password": "सुरक्षित नियंत्रण कुंजी पासवर्ड",
    "Next: Validation Links": "अगला: सत्यापन लिंक",
    "Finalize Enrollment": "नामांकन को अंतिम रूप दें",
    "Remembered login details?": "लॉगिन विवरण याद हैं?",
    "Sign in as Demo User Instantly": "डेमो उपयोगकर्ता के रूप में तुरंत साइन इन करें",
    "Linkage Policy Acknowledgement": "लिंकेज नीति स्वीकृति",

    // Admin Dashboard
    "Admin Command Node": "एडमिन कमांड नोड",
    "Active Students": "सक्रिय छात्र",
    "Educators": "शिक्षक",
    "Fees Receivable": "प्राप्य शुल्क",
    "Audit Records": "ऑडिट रिकॉर्ड",
    "Enrollment Growth Trend": "नामांकन वृद्धि की प्रवृत्ति",
    "Budget Ledger Share": "बजट बहीखाता हिस्सा",
    "Student Enrollment Directory": "छात्र नामांकन निर्देशिका",
    "Query name, grade, standard...": "नाम, ग्रेड, मानक खोजें...",
    "Enroll Student": "छात्र का नामांकन करें",
    "System Security Activity Audits": "सिस्टम सुरक्षा गतिविधि ऑडिट",
    "Certified Educators On-Duty": "ड्यूटी पर प्रमाणित शिक्षक",
    "Successfully enrolled": "सफलतापूर्वक नामांकित",

    // Student Dashboard
    "Academic Portal": "शैक्षणिक पोर्टल",
    "GPA Trend": "जीपीए ट्रेंड",
    "Welcome back, Marcus!": "स्वागत है, मार्कस!",
    "Track your curriculum progress metrics, check scheduled midterm locations, or chat with assigned tutor personnel in real-time.": "अपने पाठ्यक्रम प्रगति मेट्रिक्स को ट्रैक करें, निर्धारित मध्यावधि स्थानों की जांच करें, या वास्तविक समय में सौंपे गए ट्यूटर कर्मियों के साथ चैट करें।",
    "Exams Timeline": "परीक्षा समयरेखा",
    "Assessments Log": "मूल्यांकन लॉग",
    "Messaging Station": "संदेश स्टेशन",
    "Student Hub Academic Resources": "छात्र केंद्र शैक्षणिक संसाधन",

    // Parent Dashboard
    "Guardian Link Account": "अभिभावक लिंक खाता",
    "Student Progress Directory: Marcus Thorne": "छात्र प्रगति निर्देशिका: मार्कस थॉर्न",
    "Outstanding Balance Due": "बकाया राशि देय",
    "Homework Completion": "होमवर्क पूरा होना",
    "Average Course Grades": "औसत पाठ्यक्रम ग्रेड",
    "Itemized Tuition Billing & Fees Ledger": "विस्तृत ट्यूशन बिलिंग और शुल्क बहीखाता",
    "Pay Now": "अभी भुगतान करें",
    "Advisory Board Bulletin": "सलाहकार बोर्ड बुलेटिन",
    "Secure Payment Gateway": "सुरक्षित भुगतान गेटवे",
    "Confirm & Remit Outstanding Dues": "बकाया राशि की पुष्टि करें और भुगतान करें",

    // Tutor Dashboard
    "Academic Command": "शैक्षणिक कमान",
    "Daily Command Space": "दैनिक कमान क्षेत्र",
    "Schedule seminar session": "सेमिनार सत्र निर्धारित करें",
    "Mark Today's Classroom Attendance Roll": "आज की कक्षा उपस्थिति दर्ज करें",
    "Evaluate Assignment Draft": "असाइनमेंट ड्राफ्ट का मूल्यांकन करें",
    "Compile & Log Evaluation": "मूल्यांकन संकलित और दर्ज करें",
    "Lecture Timetable": "व्याख्यान समय सारिणी",

    // AI Chatbox
    "Hello! I am your EduManage Support Assistant. Select a quick question below or ask me about attendance, fees, messaging, grades, or study materials.": "नमस्ते! मैं आपका एडुमैनेज सहायता सहायक हूँ। नीचे एक त्वरित प्रश्न चुनें या मुझसे उपस्थिति, शुल्क, संदेश, ग्रेड या अध्ययन सामग्री के बारे में पूछें।",
    "📅 How to check attendance?": "📅 उपस्थिति की जांच कैसे करें?",
    "You can view the Attendance Calendar card on the Parent Dashboard, or under the 'Attendance Calendar' tab on the Student Dashboard. Present days are green, absent days (May 8 and May 20) are red, and weekends are grey.": "आप अभिभावक डैशबोर्ड पर उपस्थिति कैलेंडर कार्ड देख सकते हैं, या छात्र डैशबोर्ड पर 'उपस्थिति कैलेंडर' टैब के तहत देख सकते हैं। उपस्थित दिन हरे हैं, अनुपस्थित दिन (8 मई और 20 मई) लाल हैं, और सप्ताहांत भूरे रंग के हैं।",
    "💳 How to pay tuition fees?": "💳 ट्यूशन फीस का भुगतान कैसे करें?",
    "Navigate to the Tuition Billing Ledger on the Parent Dashboard. Click the 'Pay Now' button next to any pending/overdue item, enter your card details in the secure payment gateway modal, and confirm the transaction.": "अभिभावक डैशबोर्ड पर ट्यूशन बिलिंग बहीखाता पर जाएं। किसी भी लंबित/बकाया आइटम के बगल में 'अभी भुगतान करें' बटन पर क्लिक करें, सुरक्षित भुगतान गेटवे पॉप-अप में अपने कार्ड का विवरण दर्ज करें और लेनदेन की पुष्टि करें।",
    "💬 How to contact my tutor?": "💬 अपने ट्यूटर से कैसे संपर्क करें?",
    "Use the 'Messaging Station' on the Student Dashboard or the 'Direct Messages' tab on the Parent Dashboard. You can select your tutor from the dropdown menu and type a message to receive immediate simulated responses.": "छात्र डैशबोर्ड पर 'संदेह स्टेशन' या अभिभावक डैशबोर्ड पर 'सीधे संदेश' टैब का उपयोग करें। आप ड्रॉपडाउन मेनू से अपने ट्यूटर का चयन कर सकते हैं और त्वरित प्रतिक्रिया प्राप्त करने के लिए संदेश टाइप कर सकते हैं।",
    "📚 Where are study resources?": "📚 अध्ययन संसाधन कहाँ हैं?",
    "Academic materials and PDFs matching your registered courses are available under the 'Student Hub Academic Resources' section at the bottom of the Student Dashboard.": "आपके पंजीकृत पाठ्यक्रमों से मेल खाने वाली शैक्षणिक सामग्री और पीडीएफ छात्र डैशबोर्ड के निचले भाग में 'छात्र केंद्र शैक्षणिक संसाधन' अनुभाग के तहत उपलब्ध हैं।",
    "📝 How to view exam results?": "📝 परीक्षा परिणाम कैसे देखें?",
    "Go to the Student Dashboard. Under the selector menu, check the 'Exams Timeline' tab for upcoming assessments, the 'Assessments Log' tab for instructor notes and marks, or 'Term Results' to download your final PDF report.": "छात्र डैशबोर्ड पर जाएं। चयनकर्ता मेनू के तहत, आगामी मूल्यांकन के लिए 'परीक्षा समयरेखा' टैब, प्रशिक्षक नोट्स और अंकों के लिए 'मूल्यांकन लॉग' टैब, या अपनी अंतिम पीडीएफ रिपोर्ट डाउनलोड करने के लिए 'सत्र परिणाम' की जांच करें।",
    "I am operating in offline mode. Please click one of the quick questions below, or try searching for keywords like 'attendance', 'fees', 'message', 'materials', or 'results'.": "मैं ऑफ़लाइन मोड में काम कर रहा हूँ। कृपया नीचे दिए गए त्वरित प्रश्नों में से किसी एक पर क्लिक करें, या 'उपस्थिति', 'शुल्क', 'संदेश', 'सामग्री' या 'परिणाम' जैसे कीवर्ड खोजने का प्रयास करें।",
    "Assistant searching FAQ files...": "सहायक अक्सर पूछे जाने वाले प्रश्नों की फ़ाइलें खोज रहा है...",
    "EduManage AI Support": "एडुमैनेज एआई सहायता",
    "Offline Assistant": "ऑफ़लाइन सहायक",
    "Quick Questions": "त्वरित प्रश्न",
    "Ask about attendance, fees, messaging...": "उपस्थिति, शुल्क, संदेश के बारे में पूछें..."
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const cached = localStorage.getItem('edumanage_lang');
    return (cached as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('edumanage_lang', lang);
  };

  const t = (key: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    return key; // Default fallback to English key itself
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
