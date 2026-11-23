// Ready-made questionnaires shown under "New from template" in admin.html
var TEMPLATES = [
 {
  "key": "blank",
  "name": "Blank questionnaire",
  "title": "Untitled questionnaire",
  "slug": "",
  "questions": {
   "sections": [
    {
     "id": "s1",
     "title": "Section 1",
     "description": "",
     "items": []
    }
   ]
  },
  "settings": {}
 },
 {
  "key": "banking",
  "name": "Ph.D. – Digitalization & Customer Engagement (Banking, Moradabad)",
  "title": "The Impact of Digitalization on Customer Engagement in the Banking Sector of Moradabad Division",
  "slug": "digital-banking-moradabad",
  "questions": {
   "sections": [
    {
     "id": "secA",
     "title": "Section A: Demographic Profile of Respondents",
     "description": "",
     "items": [
      {
       "type": "single",
       "code": "q1_gender",
       "text": "Gender",
       "options": [
        "Male",
        "Female",
        "Transgender",
        "Prefer not to say"
       ],
       "other": false,
       "required": true
      },
      {
       "type": "single",
       "code": "q2_age",
       "text": "Age",
       "options": [
        "Below 20 years",
        "21–30 years",
        "31–40 years",
        "41–50 years",
        "51–60 years",
        "Above 60 years"
       ],
       "other": false,
       "required": true
      },
      {
       "type": "single",
       "code": "q3_education",
       "text": "Educational Qualification",
       "options": [
        "Below Matriculation",
        "Matriculation",
        "Undergraduate",
        "Graduate",
        "Postgraduate",
        "Professional/Technical Qualification"
       ],
       "other": true,
       "required": true
      },
      {
       "type": "single",
       "code": "q4_marital_status",
       "text": "Marital Status",
       "options": [
        "Married",
        "Unmarried",
        "Divorced/Separated",
        "Widowed"
       ],
       "other": true,
       "required": true
      },
      {
       "type": "single",
       "code": "q5_monthly_income",
       "text": "Monthly Income",
       "options": [
        "Below ₹10,000",
        "₹10,001–₹20,000",
        "₹20,001–₹30,000",
        "₹30,001–₹40,000",
        "₹40,001–₹50,000",
        "Above ₹50,000"
       ],
       "other": false,
       "required": true
      },
      {
       "type": "single",
       "code": "q6_occupation",
       "text": "Occupation",
       "options": [
        "Student",
        "Government/Public Sector Employee",
        "Private Sector Employee",
        "Self-employed/Business",
        "Professional",
        "Homemaker",
        "Retired"
       ],
       "other": true,
       "required": true
      },
      {
       "type": "single",
       "code": "q7_residence",
       "text": "Area of Residence",
       "options": [
        "Rural",
        "Semi-Urban",
        "Urban"
       ],
       "other": false,
       "required": true
      }
     ]
    },
    {
     "id": "secB",
     "title": "Section B: Banking and Digital Banking Profile",
     "description": "",
     "items": [
      {
       "type": "single",
       "code": "q8_bank_type",
       "text": "Which type of bank do you primarily use for your savings account?",
       "options": [
        "Public Sector Bank",
        "Private Sector Bank",
        "Cooperative Bank"
       ],
       "other": true,
       "required": true
      },
      {
       "type": "single",
       "code": "q9_aware",
       "text": "Are you aware of digital banking services?",
       "options": [
        "Yes",
        "No"
       ],
       "other": false,
       "required": true
      },
      {
       "type": "multi",
       "code": "q10",
       "text": "Which digital banking services do you currently use?",
       "options": [
        "Internet Banking",
        "Mobile Banking",
        "UPI",
        "Debit/Credit Card Services",
        "ATM Services",
        "QR Code Payments",
        "Mobile Wallets",
        "Online Bill Payments"
       ],
       "other": true,
       "required": true
      },
      {
       "type": "single",
       "code": "q11_frequency",
       "text": "How frequently do you use digital banking services?",
       "options": [
        "Several times a day",
        "Daily",
        "Several times a week",
        "Once a week",
        "Occasionally",
        "Rarely"
       ],
       "other": false,
       "required": true
      },
      {
       "type": "single",
       "code": "q12_duration",
       "text": "How long have you been using digital banking services?",
       "options": [
        "Less than 1 year",
        "1–3 years",
        "4–6 years",
        "7–10 years",
        "More than 10 years"
       ],
       "other": false,
       "required": true
      },
      {
       "type": "multi",
       "code": "q13",
       "text": "What is your main purpose for using digital banking services?",
       "options": [
        "Fund Transfer",
        "Account Balance Enquiry",
        "Online Shopping/Payments",
        "Bill Payments and Recharge",
        "Bank Statements",
        "Investment/Financial Services",
        "Loan-related Services"
       ],
       "other": true,
       "required": true
      },
      {
       "type": "single",
       "code": "q14_info_source",
       "text": "What is your main source of information about digital banking?",
       "options": [
        "Bank/Bank Employees",
        "Friends and Relatives",
        "Social Media",
        "Internet/Websites",
        "Television/Newspapers",
        "Advertisements"
       ],
       "other": true,
       "required": true
      },
      {
       "type": "single",
       "code": "q15_main_factor",
       "text": "What is the main factor encouraging you to use digital banking?",
       "options": [
        "Convenience",
        "Time Saving",
        "Ease of Use",
        "24/7 Accessibility",
        "Security",
        "Better Service Quality",
        "Personalized Services"
       ],
       "other": true,
       "required": true
      }
     ]
    },
    {
     "id": "secC",
     "title": "Section C: Digitalization of Banking Services",
     "description": "Please indicate your level of agreement with each statement based on your experience.",
     "items": [
      {
       "type": "likert",
       "code": "sq",
       "text": "C1. Service Quality",
       "dimension": "Service Quality",
       "required": true,
       "scalePreset": "agree5",
       "scale": [
        [
         5,
         "Strongly Agree"
        ],
        [
         4,
         "Agree"
        ],
        [
         3,
         "Neutral"
        ],
        [
         2,
         "Disagree"
        ],
        [
         1,
         "Strongly Disagree"
        ]
       ],
       "statements": [
        {
         "code": "q16_sq1",
         "text": "Digital banking services provided by my bank are easy to use."
        },
        {
         "code": "q17_sq2",
         "text": "Digital banking transactions are completed quickly and efficiently."
        },
        {
         "code": "q18_sq3",
         "text": "My bank's digital banking services are reliable and consistent."
        },
        {
         "code": "q19_sq4",
         "text": "My bank's mobile application/website is user-friendly."
        },
        {
         "code": "q20_sq5",
         "text": "Digital banking services provide accurate and updated information."
        },
        {
         "code": "q21_sq6",
         "text": "My bank responds promptly to complaints and problems related to digital banking."
        }
       ]
      },
      {
       "type": "likert",
       "code": "acc",
       "text": "C2. 24/7 Accessibility",
       "dimension": "24/7 Accessibility",
       "required": true,
       "scalePreset": "agree5",
       "scale": [
        [
         5,
         "Strongly Agree"
        ],
        [
         4,
         "Agree"
        ],
        [
         3,
         "Neutral"
        ],
        [
         2,
         "Disagree"
        ],
        [
         1,
         "Strongly Disagree"
        ]
       ],
       "statements": [
        {
         "code": "q22_acc1",
         "text": "I can access my bank account at any time through digital channels."
        },
        {
         "code": "q23_acc2",
         "text": "I can perform banking transactions outside normal banking hours."
        },
        {
         "code": "q24_acc3",
         "text": "Digital banking services are accessible during weekends and public holidays."
        },
        {
         "code": "q25_acc4",
         "text": "I can access digital banking services from different locations."
        },
        {
         "code": "q26_acc5",
         "text": "Digital banking enables me to complete urgent transactions without visiting a bank branch."
        },
        {
         "code": "q27_acc6",
         "text": "The availability of digital banking services encourages me to interact more frequently with my bank."
        }
       ]
      },
      {
       "type": "likert",
       "code": "cus",
       "text": "C3. Customization",
       "dimension": "Customization",
       "required": true,
       "scalePreset": "agree5",
       "scale": [
        [
         5,
         "Strongly Agree"
        ],
        [
         4,
         "Agree"
        ],
        [
         3,
         "Neutral"
        ],
        [
         2,
         "Disagree"
        ],
        [
         1,
         "Strongly Disagree"
        ]
       ],
       "statements": [
        {
         "code": "q28_cus1",
         "text": "My bank provides digital banking services according to different customer needs."
        },
        {
         "code": "q29_cus2",
         "text": "My bank offers personalized digital banking services."
        },
        {
         "code": "q30_cus3",
         "text": "I can customize my preferences on digital banking platforms."
        },
        {
         "code": "q31_cus4",
         "text": "I receive digital offers and services relevant to my financial needs."
        },
        {
         "code": "q32_cus5",
         "text": "My bank provides personalized notifications and transaction alerts."
        },
        {
         "code": "q33_cus6",
         "text": "My bank recommends products and services based on my banking requirements."
        }
       ]
      },
      {
       "type": "likert",
       "code": "sec",
       "text": "C4. Security",
       "dimension": "Security",
       "required": true,
       "scalePreset": "agree5",
       "scale": [
        [
         5,
         "Strongly Agree"
        ],
        [
         4,
         "Agree"
        ],
        [
         3,
         "Neutral"
        ],
        [
         2,
         "Disagree"
        ],
        [
         1,
         "Strongly Disagree"
        ]
       ],
       "statements": [
        {
         "code": "q34_sec1",
         "text": "I feel secure while conducting transactions through digital banking services."
        },
        {
         "code": "q35_sec2",
         "text": "My bank adequately protects my personal information."
        },
        {
         "code": "q36_sec3",
         "text": "My financial information remains secure while using digital banking services."
        },
        {
         "code": "q37_sec4",
         "text": "My bank uses appropriate authentication measures to protect my account."
        },
        {
         "code": "q38_sec5",
         "text": "I trust my bank to protect me against digital banking fraud."
        },
        {
         "code": "q39_sec6",
         "text": "Security features increase my confidence in using digital banking services."
        }
       ]
      }
     ]
    },
    {
     "id": "secD",
     "title": "Section D: Customer Engagement",
     "description": "Customer engagement is measured through behavioural, emotional and cognitive dimensions. Please use the same five-point scale.",
     "items": [
      {
       "type": "likert",
       "code": "be",
       "text": "D1. Behavioural Customer Engagement",
       "dimension": "Behavioural Customer Engagement",
       "required": true,
       "scalePreset": "agree5",
       "scale": [
        [
         5,
         "Strongly Agree"
        ],
        [
         4,
         "Agree"
        ],
        [
         3,
         "Neutral"
        ],
        [
         2,
         "Disagree"
        ],
        [
         1,
         "Strongly Disagree"
        ]
       ],
       "statements": [
        {
         "code": "q40_be1",
         "text": "I frequently use my bank's digital banking services."
        },
        {
         "code": "q41_be2",
         "text": "I prefer digital banking channels for my routine banking transactions."
        },
        {
         "code": "q42_be3",
         "text": "I actively use different digital services offered by my bank."
        },
        {
         "code": "q43_be4",
         "text": "I am willing to try new digital banking services introduced by my bank."
        },
        {
         "code": "q44_be5",
         "text": "I intend to continue using my bank's digital banking services in the future."
        }
       ]
      },
      {
       "type": "likert",
       "code": "ee",
       "text": "D2. Emotional Customer Engagement",
       "dimension": "Emotional Customer Engagement",
       "required": true,
       "scalePreset": "agree5",
       "scale": [
        [
         5,
         "Strongly Agree"
        ],
        [
         4,
         "Agree"
        ],
        [
         3,
         "Neutral"
        ],
        [
         2,
         "Disagree"
        ],
        [
         1,
         "Strongly Disagree"
        ]
       ],
       "statements": [
        {
         "code": "q45_ee1",
         "text": "I feel comfortable while using my bank's digital banking services."
        },
        {
         "code": "q46_ee2",
         "text": "I feel satisfied with my bank's digital banking services."
        },
        {
         "code": "q47_ee3",
         "text": "I feel confident while conducting transactions through digital banking."
        },
        {
         "code": "q48_ee4",
         "text": "I feel positively connected with my bank through its digital services."
        },
        {
         "code": "q49_ee5",
         "text": "I feel that my bank values me as a digital banking customer."
        }
       ]
      },
      {
       "type": "likert",
       "code": "ce",
       "text": "D3. Cognitive Customer Engagement",
       "dimension": "Cognitive Customer Engagement",
       "required": true,
       "scalePreset": "agree5",
       "scale": [
        [
         5,
         "Strongly Agree"
        ],
        [
         4,
         "Agree"
        ],
        [
         3,
         "Neutral"
        ],
        [
         2,
         "Disagree"
        ],
        [
         1,
         "Strongly Disagree"
        ]
       ],
       "statements": [
        {
         "code": "q50_ce1",
         "text": "I actively think about the digital banking services offered by my bank."
        },
        {
         "code": "q51_ce2",
         "text": "I pay attention to new digital products and services introduced by my bank."
        },
        {
         "code": "q52_ce3",
         "text": "I try to understand the features and benefits of new digital banking services."
        },
        {
         "code": "q53_ce4",
         "text": "I actively seek information about my bank's digital banking services."
        },
        {
         "code": "q54_ce5",
         "text": "I am interested in learning about new digital technologies introduced by my bank."
        }
       ]
      }
     ]
    },
    {
     "id": "secE",
     "title": "Section E: Comparison and Overall Perception",
     "description": "",
     "items": [
      {
       "type": "single",
       "code": "q55_digital_bank_type",
       "text": "Which type of bank do you primarily use for digital banking?",
       "options": [
        "Public Sector Bank",
        "Private Sector Bank"
       ],
       "other": false,
       "required": true
      },
      {
       "type": "single",
       "code": "q56_better_bank",
       "text": "Which type of bank do you think provides better digital banking services?",
       "options": [
        "Public Sector Bank",
        "Private Sector Bank",
        "Both are equally good",
        "Cannot say"
       ],
       "other": false,
       "required": true
      },
      {
       "type": "single",
       "code": "q57_main_influence",
       "text": "Which factor most influences your engagement with your bank's digital services?",
       "options": [
        "Service Quality",
        "24/7 Accessibility",
        "Customization",
        "Security",
        "All of the above"
       ],
       "other": false,
       "required": true
      },
      {
       "type": "single",
       "code": "q58_interaction_increased",
       "text": "Compared with traditional branch banking, digital banking has increased my interaction with my bank.",
       "options": [
        "Strongly Agree",
        "Agree",
        "Neutral",
        "Disagree",
        "Strongly Disagree"
       ],
       "other": false,
       "required": true
      },
      {
       "type": "single",
       "code": "q59_overall_rating",
       "text": "Overall, how would you rate your experience with your bank's digital banking services?",
       "options": [
        "Excellent",
        "Very Good",
        "Good",
        "Average",
        "Poor"
       ],
       "other": false,
       "required": true
      },
      {
       "type": "long",
       "code": "q60_suggestions",
       "text": "What suggestions would you like to provide for improving customer engagement through digital banking services?",
       "required": false
      }
     ]
    }
   ]
  },
  "settings": {
   "texts": {
    "intro": "Dear Respondent,\n\nI am conducting a Ph.D. research study entitled “The Impact of Digitalization on Customer Engagement in the Banking Sector of Moradabad Division.” The study aims to examine the impact of digitalization on customer engagement, particularly with reference to service quality, 24/7 accessibility, customization and security. It also examines customer engagement through behavioural, emotional and cognitive dimensions and compares Public Sector and Private Sector Banks.\n\nPlease respond honestly on the basis of your actual experience of using digital banking services. Your responses will be kept confidential and used only for academic and research purposes. Your identity will not be disclosed.",
    "thankYou": "THANK YOU\n\nThank you for your valuable time and participation in this research study."
   }
  }
 }
];
