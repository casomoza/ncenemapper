-- Bulk insert: 30 new program pathway maps
-- Generated from 2026-2027 Norco College catalog
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/exuretutssbihksumeyo/sql

DO $$
DECLARE
  prog_id uuid;
BEGIN

  -- ── Business Administration - Concentration in Accounting ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'business-administration-concentration-in-accounting',
    'Business Administration - Concentration in Accounting',
    'A.S. Degree | Certificate of Achievement',
    'School of Business & Management',
    30,
    'Prepares individuals to practice the profession of accounting and to perform related business functions, including financial accounting, managerial accounting, cost accounting, budget control, tax accounting, legal aspects of accounting, and accounting research methods.',
    '["Apply basic business and accounting calculations and analyses","Apply accounting principles related to payroll, cost, income tax, and computerized accounting","Analyze and interpret data and reports for a variety of business entities","Develop and apply principles of moral judgment and ethical behavior to business situations"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-1A', 'Principles of Accounting I', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to accounting principles and practice, as a manual and/or computerized information system that provides and interprets economic data for economic units within a global society. Includes recording, analyzing, and summarizing procedures used in preparing financial statements. 54.00 hours lecture. (Letter grade', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-10', 'Introduction to Business', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Scope, function and organization of contemporary business; fundamentals, concepts, principles, and current practices in the major areas of business activity with an integrated global perspective. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-18A', 'Business Law I', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Covers the fundamental legal principles pertaining to business transactions. Provides and overview of an introduction to the legal process and dispute resolution. Coverage of federal and state court systems and a comprehensive study of contracts under the common law and the Uniform Commercial Code. Additional coverage includes include sources of law, business ethics, constitutional law, tort law, agency, business organizations, and criminal law as applied to business. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-20', 'Business Mathematics', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to quantitative approaches for solving common business problems using general mathematics and first degree equations. Includes the development and solution of problems in the areas of business statistics, trade and cash discounts, markups and markdowns, perishables, payroll, taxes, simple interest, promissory notes, compound interest, present and future value, annuities and sinking funds, installment buying and credit cards, home ownership costs, insurance, stocks and bonds, mutual funds, financial reports, depreciation, inventory, and overhead. 54.00 hours lecture. (Letter grade', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-22', 'Management Communications', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Examines the dynamics of organizational communication relevant in current business environment. Focus is on composition and delivery of appropriate methods of communication in various business situations as a manager, including business documents, presentations, and job interviews. Practical experience is attained in verbal/non-verbal and written communication skills that fosters growth and advancement in business opportunities. Best suited for those aspiring to advance their careers by being prepared to be potential managers and leaders. 54.00 hours lecture. (Letter grade only)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CIS-1A', 'Introduction to Computer Information Systems', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Examination of information systems and their role in business. Focus on information systems, database management systems, networking, e-commerce, ethics and security, computer systems hardware and software components. Application of these concepts and methods through hands-on projects developing computer-based solutions to business problems. Utilizing a systems approach students will use databases, spreadsheets, word processors, presentation graphics, and the Internet to solve business problems and communicate solutions. 54.00 hours lecture and 18.00 hours laboratory. (TBA Option) (Letter grade only)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-1B', 'Principles of Accounting II', 3, 1, 'Spring',
      'core', 'ACC 1A', '[]'::jsonb,
      'A study of managerial accounting principles and information systems including basic concepts, limitations, tools and methods to support the internal decision-making functions of an organization. 54.00 hours lecture. (Letter grade only)', false, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-40', 'ACC-40', 3, 1, 'Spring',
      'elective', NULL, '[]'::jsonb,
      NULL, true, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-55', 'Applied Accounting/Bookkeeping', 3, 2, 'Fall',
      'elective', 'None.', '[]'::jsonb,
      'An introductory course for students who are non-accounting majors. Basic bookkeeping and accounting principles for both merchandising and service-oriented small business enterprises. Emphasis on the development of skills to record business transactions for cash and accrual methods, as well as the procedures to prepare financial statements and complete an accounting cycle. Attention is given to special journals, subsidiary ledgers, and payroll and banking procedures. 54.00 hours lecture. (Same as CAT-55) (Letter grade or Pass/No Pass option)', true, NULL, 8
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-62', 'Payroll Accounting', 3, 2, 'Fall',
      'elective', 'ACC 1A or ACC 55 or CAT 55', '[]'::jsonb,
      'Covers accounting for payroll and examines aspects of the Social Security Act, California Unemployment Insurance Act, and the California Worker''s Compensation Insurance Act. Payroll principles applied through the use of microcomputers. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', true, NULL, 9
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-63', 'ACC-63', 3, 2, 'Fall',
      'elective', NULL, '[]'::jsonb,
      NULL, true, NULL, 10
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-65', 'QuickBooks Accounting', 3, 2, 'Fall',
      'elective', 'ACC 1A or ACC 55', '[]'::jsonb,
      'An introduction to QuickBooks Accounting Software, which integrates accounting principles, transactions, and events using their automated system relating to both service and merchandising companies. Students learn to record and process accounting transactions and events using up-to-date software that prepares them for actual situations that relate to the creation of a company, working with customers and vendors, posting sales receipts and payments, managing inventory and budgets, as well as customizing and extending QuickBooks software capabilities. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', true, NULL, 11
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-67', 'U.S. and California Income Tax Preparation', 4, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'U.S. and California income tax principles and tax return preparation as it relates to individuals, sole proprietorships, and other business entities. This course is certified by the California Tax Education Council (CTEC) as fulfilling the 60-hour qualifying education requirement imposed by the State of California for becoming a Registered Tax Preparer. 72.00 hours lecture. (Letter grade', true, NULL, 12
    );
  END IF;

  -- ── Business Administration - Concentration in General Business ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'business-administration-concentration-in-general-business',
    'Business Administration - Concentration in General Business',
    'Certificate of Achievement',
    'School of Business & Management',
    30,
    'Focuses on the general study of business, including domestic, international, and electronic commerce, and the important ways in which business impacts daily life. Prepares individuals to apply business principles and techniques in various career settings.',
    '["Use technology to analyze business decisions and enhance business communications","Apply basic business and accounting calculations and analyses","Analyze the law as it pertains to business organizations","Explain and develop the marketing mix and analyze marketing mix variables"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-1A', 'Principles of Accounting I', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to accounting principles and practice, as a manual and/or computerized information system that provides and interprets economic data for economic units within a global society. Includes recording, analyzing, and summarizing procedures used in preparing financial statements. 54.00 hours lecture. (Letter grade', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-10', 'Introduction to Business', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Scope, function and organization of contemporary business; fundamentals, concepts, principles, and current practices in the major areas of business activity with an integrated global perspective. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-18A', 'Business Law I', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Covers the fundamental legal principles pertaining to business transactions. Provides and overview of an introduction to the legal process and dispute resolution. Coverage of federal and state court systems and a comprehensive study of contracts under the common law and the Uniform Commercial Code. Additional coverage includes include sources of law, business ethics, constitutional law, tort law, agency, business organizations, and criminal law as applied to business. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-20', 'Business Mathematics', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'An introduction to quantitative approaches for solving common business problems using general mathematics and first degree equations. Includes the development and solution of problems in the areas of business statistics, trade and cash discounts, markups and markdowns, perishables, payroll, taxes, simple interest, promissory notes, compound interest, present and future value, annuities and sinking funds, installment buying and credit cards, home ownership costs, insurance, stocks and bonds, mutual funds, financial reports, depreciation, inventory, and overhead. 54.00 hours lecture. (Letter grade', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-22', 'Management Communications', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Examines the dynamics of organizational communication relevant in current business environment. Focus is on composition and delivery of appropriate methods of communication in various business situations as a manager, including business documents, presentations, and job interviews. Practical experience is attained in verbal/non-verbal and written communication skills that fosters growth and advancement in business opportunities. Best suited for those aspiring to advance their careers by being prepared to be potential managers and leaders. 54.00 hours lecture. (Letter grade only)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CIS-1A', 'Introduction to Computer Information Systems', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Examination of information systems and their role in business. Focus on information systems, database management systems, networking, e-commerce, ethics and security, computer systems hardware and software components. Application of these concepts and methods through hands-on projects developing computer-based solutions to business problems. Utilizing a systems approach students will use databases, spreadsheets, word processors, presentation graphics, and the Internet to solve business problems and communicate solutions. 54.00 hours lecture and 18.00 hours laboratory. (TBA Option) (Letter grade only)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-1B', 'Principles of Accounting II', 3, 2, 'Fall',
      'elective', 'ACC 1A', '[]'::jsonb,
      'A study of managerial accounting principles and information systems including basic concepts, limitations, tools and methods to support the internal decision-making functions of an organization. 54.00 hours lecture. (Letter grade only)', true, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-40', 'BUS-40', 3, 2, 'Fall',
      'elective', NULL, '[]'::jsonb,
      NULL, true, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-80', 'Principles of Logistics', 3, 2, 'Fall',
      'elective', 'None.', '[]'::jsonb,
      'An introduction to the management of business logistics functions including purchasing, inventory management, transportation, warehousing, and their related technologies. Focus is on integration of logistics functions to improve overall supply chain customer service and cost performance. 54.00 hours lecture. (Letter grade', true, NULL, 8
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MAG-51', 'Elements of Supervision', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'Overview of responsibilities of a supervisor in industry including organizational structure, training, work assignments, productivity, quality control, evaluations, and management-employee relations. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', true, NULL, 9
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MAG-53', 'Human Relations', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'A practical application of basic psychology in building better employer-employee relationships. Examines effective human relation techniques. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', true, NULL, 10
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MKT-20', 'Principles of Marketing', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'Examines the role of marketing as it relates to society and economic development. The course will analyze products, consumer, marketing research, and strategic market planning. The course will survey, with a global perspective, the selection of target markets as well as the development of the marketing mix – place, product, price, and promotion. 54.00 hours lecture. (Letter grade', true, NULL, 11
    );
  END IF;

  -- ── Business Administration - Concentration in Logistics Management ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'business-administration-concentration-in-logistics-managemen',
    'Business Administration - Concentration in Logistics Management',
    'A.S. Degree | Certificate of Achievement',
    'School of Business & Management',
    30,
    'Prepares students for entry into or career growth within the logistics industry. Focuses on integrated logistics, a necessity for management of effective and efficient supply chains, covering warehousing, transportation, service contracting, purchasing, and global logistics.',
    '["Compare roles and objectives of the logistics disciplines","Contribute knowledge needed by multidisciplinary teams to integrate and exceed end user expectations","Analyze, prepare, file and process claims when freight disputes arise","Identify 3rd party logistics provider and client needs in negotiations, bidding, and contracts"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-1A', 'Principles of Accounting I', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to accounting principles and practice, as a manual and/or computerized information system that provides and interprets economic data for economic units within a global society. Includes recording, analyzing, and summarizing procedures used in preparing financial statements. 54.00 hours lecture. (Letter grade', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-10', 'Introduction to Business', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Scope, function and organization of contemporary business; fundamentals, concepts, principles, and current practices in the major areas of business activity with an integrated global perspective. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-18A', 'Business Law I', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Covers the fundamental legal principles pertaining to business transactions. Provides and overview of an introduction to the legal process and dispute resolution. Coverage of federal and state court systems and a comprehensive study of contracts under the common law and the Uniform Commercial Code. Additional coverage includes include sources of law, business ethics, constitutional law, tort law, agency, business organizations, and criminal law as applied to business. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-20', 'Business Mathematics', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'An introduction to quantitative approaches for solving common business problems using general mathematics and first degree equations. Includes the development and solution of problems in the areas of business statistics, trade and cash discounts, markups and markdowns, perishables, payroll, taxes, simple interest, promissory notes, compound interest, present and future value, annuities and sinking funds, installment buying and credit cards, home ownership costs, insurance, stocks and bonds, mutual funds, financial reports, depreciation, inventory, and overhead. 54.00 hours lecture. (Letter grade', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-22', 'Management Communications', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Examines the dynamics of organizational communication relevant in current business environment. Focus is on composition and delivery of appropriate methods of communication in various business situations as a manager, including business documents, presentations, and job interviews. Practical experience is attained in verbal/non-verbal and written communication skills that fosters growth and advancement in business opportunities. Best suited for those aspiring to advance their careers by being prepared to be potential managers and leaders. 54.00 hours lecture. (Letter grade only)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CIS-1A', 'Introduction to Computer Information Systems', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Examination of information systems and their role in business. Focus on information systems, database management systems, networking, e-commerce, ethics and security, computer systems hardware and software components. Application of these concepts and methods through hands-on projects developing computer-based solutions to business problems. Utilizing a systems approach students will use databases, spreadsheets, word processors, presentation graphics, and the Internet to solve business problems and communicate solutions. 54.00 hours lecture and 18.00 hours laboratory. (TBA Option) (Letter grade only)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-80', 'Principles of Logistics', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the management of business logistics functions including purchasing, inventory management, transportation, warehousing, and their related technologies. Focus is on integration of logistics functions to improve overall supply chain customer service and cost performance. 54.00 hours lecture. (Letter grade', false, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-85', 'Warehouse Management', 3, 2, 'Fall',
      'elective', 'None.', '[]'::jsonb,
      'Introduction to an integrated logistics approach to warehouse management. Includes the role of warehousing within the supply chain, performance metrics, applicable leadership basics, how to interact with other logistics managers to optimize overall activity, as well as principles of warehouse location, design, layout, operating functions, and customer service. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', true, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-86', 'Transportation and Traffic Management', 3, 2, 'Fall',
      'elective', 'None.', '[]'::jsonb,
      'A study of the freight transportation system including the demand for freight movement, laws, regulations, pricing, and policies, traffic management and international transportation issues. Focuses on how transportation collaborates with other supply chain functions to optimize cost and customer service. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', true, NULL, 8
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-87', 'Purchasing and Supply Management', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'Study of the purchasing and supply manager''s responsibilities including the identification, acquisition, positioning and management of materials, services and equipment that organizations needs to attain their goals. Emphasis is on decision making, integration with suppliers, critical internal relationships, and customer (end user) service. 54.00 hours lecture. (Letter grade or Pass/No Pass', true, NULL, 9
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-90', 'International Logistics', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'An introduction to the role of logistics in global business; including the economic and service characteristics of international transportation providers, the government''s role, documentation and terms of sale used in global business, and the fundamentals of effective export and import management. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', true, NULL, 10
    );
  END IF;

  -- ── Business Administration - Concentration in Management ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'business-administration-concentration-in-management',
    'Business Administration - Concentration in Management',
    'A.S. Degree | Certificate of Achievement',
    'School of Business & Management',
    30,
    'Prepares individuals to plan, organize, direct, and control the functions and processes of a firm or organization with an emphasis on people as the most important asset. Prepares students seeking management positions to be better candidates for promotion.',
    '["Use technology to analyze business decisions and enhance business communications","Apply sound management practices","Analyze and apply appropriate managerial practices in ethics, human resources, and quality management","Apply basic business and accounting calculations and analyses"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-1A', 'Principles of Accounting I', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to accounting principles and practice, as a manual and/or computerized information system that provides and interprets economic data for economic units within a global society. Includes recording, analyzing, and summarizing procedures used in preparing financial statements. 54.00 hours lecture. (Letter grade', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-10', 'Introduction to Business', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Scope, function and organization of contemporary business; fundamentals, concepts, principles, and current practices in the major areas of business activity with an integrated global perspective. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-18A', 'Business Law I', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Covers the fundamental legal principles pertaining to business transactions. Provides and overview of an introduction to the legal process and dispute resolution. Coverage of federal and state court systems and a comprehensive study of contracts under the common law and the Uniform Commercial Code. Additional coverage includes include sources of law, business ethics, constitutional law, tort law, agency, business organizations, and criminal law as applied to business. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-20', 'Business Mathematics', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'An introduction to quantitative approaches for solving common business problems using general mathematics and first degree equations. Includes the development and solution of problems in the areas of business statistics, trade and cash discounts, markups and markdowns, perishables, payroll, taxes, simple interest, promissory notes, compound interest, present and future value, annuities and sinking funds, installment buying and credit cards, home ownership costs, insurance, stocks and bonds, mutual funds, financial reports, depreciation, inventory, and overhead. 54.00 hours lecture. (Letter grade', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-22', 'Management Communications', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Examines the dynamics of organizational communication relevant in current business environment. Focus is on composition and delivery of appropriate methods of communication in various business situations as a manager, including business documents, presentations, and job interviews. Practical experience is attained in verbal/non-verbal and written communication skills that fosters growth and advancement in business opportunities. Best suited for those aspiring to advance their careers by being prepared to be potential managers and leaders. 54.00 hours lecture. (Letter grade only)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CIS-1A', 'Introduction to Computer Information Systems', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Examination of information systems and their role in business. Focus on information systems, database management systems, networking, e-commerce, ethics and security, computer systems hardware and software components. Application of these concepts and methods through hands-on projects developing computer-based solutions to business problems. Utilizing a systems approach students will use databases, spreadsheets, word processors, presentation graphics, and the Internet to solve business problems and communicate solutions. 54.00 hours lecture and 18.00 hours laboratory. (TBA Option) (Letter grade only)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MAG-44', 'Principles of Management', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'For those who are in management, preparing for a potential promotion, or interested in the management process. Includes the primary functions of planning, organizing, controlling, and leading as well as related skills such as team development, motivation and communication techniques, and quality management. Also, social responsibility and a global perspective are emphasized. 54.00 hours lecture. (Letter grade only)', false, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MAG-53', 'Human Relations', 3, 2, 'Fall',
      'elective', 'None.', '[]'::jsonb,
      'A practical application of basic psychology in building better employer-employee relationships. Examines effective human relation techniques. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', true, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MAG-56', 'HRM: Human Resources Management', 3, 2, 'Fall',
      'elective', 'None.', '[]'::jsonb,
      'Examines the manager’s responsibility for implementing human resources applications involving the selection, training, evaluation, motivation and promotion of personnel. Compares and contrasts alternatives leading to innovative and socially responsible solutions to current employee relations issues with the workplace. 54.00 hours lecture. (Letter grade only)', true, NULL, 8
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MAG-60', 'MAG-60', 3, 2, 'Spring',
      'elective', NULL, '[]'::jsonb,
      NULL, true, NULL, 9
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-48', 'BUS-48', 3, 2, 'Spring',
      'elective', NULL, '[]'::jsonb,
      NULL, true, NULL, 10
    );
  END IF;

  -- ── Business Administration - Concentration in Real Estate ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'business-administration-concentration-in-real-estate',
    'Business Administration - Concentration in Real Estate',
    'A.S. Degree | Certificate of Achievement',
    'School of Business & Management',
    30,
    'Prepares individuals to develop, buy, sell, appraise, and manage real property. Includes instruction in land use development policy, real estate law, real estate marketing procedures, agency management, brokerage, property inspection and appraisal, and property management.',
    '["Analyze ethical and procedural problems in residential real estate sales transactions","Discuss and evaluate real estate marketing and sales techniques","Calculate real estate taxes and solve basic real estate mathematics problems","Explain and evaluate methods of financing real estate purchases and securing loans"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-1A', 'Principles of Accounting I', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to accounting principles and practice, as a manual and/or computerized information system that provides and interprets economic data for economic units within a global society. Includes recording, analyzing, and summarizing procedures used in preparing financial statements. 54.00 hours lecture. (Letter grade', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-10', 'Introduction to Business', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Scope, function and organization of contemporary business; fundamentals, concepts, principles, and current practices in the major areas of business activity with an integrated global perspective. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-18A', 'Business Law I', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Covers the fundamental legal principles pertaining to business transactions. Provides and overview of an introduction to the legal process and dispute resolution. Coverage of federal and state court systems and a comprehensive study of contracts under the common law and the Uniform Commercial Code. Additional coverage includes include sources of law, business ethics, constitutional law, tort law, agency, business organizations, and criminal law as applied to business. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-20', 'Business Mathematics', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'An introduction to quantitative approaches for solving common business problems using general mathematics and first degree equations. Includes the development and solution of problems in the areas of business statistics, trade and cash discounts, markups and markdowns, perishables, payroll, taxes, simple interest, promissory notes, compound interest, present and future value, annuities and sinking funds, installment buying and credit cards, home ownership costs, insurance, stocks and bonds, mutual funds, financial reports, depreciation, inventory, and overhead. 54.00 hours lecture. (Letter grade', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-22', 'Management Communications', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Examines the dynamics of organizational communication relevant in current business environment. Focus is on composition and delivery of appropriate methods of communication in various business situations as a manager, including business documents, presentations, and job interviews. Practical experience is attained in verbal/non-verbal and written communication skills that fosters growth and advancement in business opportunities. Best suited for those aspiring to advance their careers by being prepared to be potential managers and leaders. 54.00 hours lecture. (Letter grade only)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CIS-1A', 'Introduction to Computer Information Systems', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Examination of information systems and their role in business. Focus on information systems, database management systems, networking, e-commerce, ethics and security, computer systems hardware and software components. Application of these concepts and methods through hands-on projects developing computer-based solutions to business problems. Utilizing a systems approach students will use databases, spreadsheets, word processors, presentation graphics, and the Internet to solve business problems and communicate solutions. 54.00 hours lecture and 18.00 hours laboratory. (TBA Option) (Letter grade only)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'RLE-80', 'Real Estate Principles', 3, 2, 'Fall',
      'elective', 'None.', '[]'::jsonb,
      'Basic laws and principles of California real estate; fundamentals, terminology, concepts, current practices, and current market trends in real estate. Assists those preparing for the real estate sales person and broker license examination. 54.00 hours lecture. (Letter grade', true, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'RLE-81', 'Real Estate Practices', 3, 2, 'Fall',
      'elective', 'None.', '[]'::jsonb,
      'Covers basic laws and principles of California real estate, terminology, and daily operations in a real estate brokerage, including listing, prospecting, advertising, financing, sales techniques, escrow, and ethics. Applies towards the State’s educational requirements for the Brokers examination. 54.00 hours lecture. (Letter grade only)', true, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'RLE-82', 'Legal Aspects of Real Estate', 3, 2, 'Fall',
      'elective', 'None.', '[]'::jsonb,
      'Introduction to California real estate law, including rights incident to property ownership and management, agency, contracts, and application to real estate transfer, conveyance, probate proceedings, trust deeds, and foreclosure, as well as recent legislation governing real estate transactions. Applies toward educational requirement of brokers examination. 54.00 hours lecture. (Letter grade only)', true, NULL, 8
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'RLE-83', 'Real Estate Finance', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'Analysis of real estate financing, including lending policies and problems in financing transactions in residential, apartment, commercial, and special purpose properties. Methods of financing properties emphasized. 54.00 hours lecture. (Letter grade only)', true, NULL, 9
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'RLE-84', 'Real Estate Appraisal', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'Purposes of appraisals, the appraisal process, and the different approaches, methods, and techniques used to determine the value of various types of property. Emphasis will be on residential and single-unit properties. 54.00 hours lecture. (Letter grade only)', true, NULL, 10
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'RLE-85', 'Real Estate Economics', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'Trends and factors affecting the value of real estate; the nature and classification of land economics; the development of property, construction and subdivision, economic values and real estate evaluation; real estate cycles and business fluctuations, residential market trends, real and special purpose property trends. 54.00 hours lecture. (Letter grade only)', true, NULL, 11
    );
  END IF;

  -- ── Business Information Worker ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'business-information-worker',
    'Business Information Worker',
    'A.S. Degree | Certificate of Achievement',
    'School of Business & Management',
    19,
    'Designed to prepare students for entry-level and administrative support in a variety of fields and businesses. Students develop computer literacy, keyboarding skills, and proficiency in word processing, spreadsheet, presentation graphics, and scheduling software.',
    '["Demonstrate computer literacy with respect to computer hardware and software applications","Apply standard rules of business conduct and customer service","Develop specialized keyboarding skills at an employable level of accuracy and speed","Use word processing, spreadsheet, presentation graphics, and scheduling software to perform business and office tasks"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CAT-1A', 'Business Etiquette', 1, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Practical human relations skills with a primary emphasis on soft skills and expected workplace behaviors. Includes the essentials of appropriate and professional business communications and protocols using email, text, phone, portable devices, video and teleconferencing, and social media in the workplace. 18.00 hours lecture. (Letter grade or Pass/No Pass option)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CAT-3', 'Computer Applications for Business', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Introduces a suite of computer applications used in business and office professions. Individuals who are already established in these professions may also benefit from skills emphasized which include: use of basic operating system functions, file management, word processing, spreadsheets, database management, and presentation graphics. 45.00 hours lecture and 27.00 hours laboratory. (TBA Option) (Same as CIS-3) (Pass/No Pass only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CAT-31', 'Business Communication Fundamentals', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'This course covers essential communication skills and techniques important to the modern workplace, including written, verbal, listening, and nonverbal communication by providing practical applications. Learners discuss, critique, and practice business-writing strategies to produce messages, letters, reports, email, and workplace communication while developing critical thinking skills. The course emphasizes planning, organizing, composing, and revising business documents using word processing software for written documents and presentation graphics software to create and deliver professional level reports. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CAT-51', 'Intermediate Keyboarding/Document Formatting', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Mastery of professional keyboarding skills and document production. Emphasis placed on increasing speed, improving accuracy, developing and applying formatting skills and document production techniques using word processing software. 45.00 hours lecture and 27.00 hours laboratory. (TBA Option) (Letter grade or Pass/', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CAT-90', 'Microsoft Outlook', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the features of Microsoft Outlook. Students learn how to manage messages, schedule appointments, organize and manage tasks and contact lists, and customize Outlook for the workplace. Emphasis is placed on the use of Outlook for communication, sharing information, and productivity within a company or small business. 45.00 hours lecture and 27.00 hours laboratory. (TBA Option) (Same as CIS-90) (Letter grade or Pass/No Pass option)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CAT-93', 'Computers for Beginners', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'A practical step-by-step introduction to computer literacy topics including computer hardware and software, application skills, the Internet and Internet searching, Web page creation, and computer ethics. 45.00 hours lecture and 27.00 hours laboratory. (TBA Option) (Same as CIS-93) (Letter grade or Pass/No Pass option)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CAT-98A', 'Introduction to Excel', 1.5, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Introductory spreadsheet development using Microsoft Excel for business and scientific related applications. The course covers introductory through intermediate spreadsheet development. 18.00 hours lecture and 27.00 hours laboratory. (TBA Option) (Same as CIS-98A) (Letter grade or Pass/No Pass option)', false, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CAT-98B', 'Advanced Excel', 1.5, 2, 'Fall',
      'core', 'CAT 98A or CIS 98A', '[]'::jsonb,
      'Advanced concepts of Microsoft Excel including managing large spreadsheets, creating and working with databases, creating and using templates, and macro creation. Spreadsheet manipulation with advanced macro techniques, customizing Excel screen and toolbars and solving problems with goal seeker and solver. 18.00 hours lecture and 27.00 hours laboratory. (TBA Option) (Same as CIS-98B) (Letter grade or Pass/No Pass option)', false, NULL, 7
    );
  END IF;

  -- ── Entrepreneurial Essentials ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'entrepreneurial-essentials',
    'Entrepreneurial Essentials',
    'Certificate of Achievement',
    'School of Business & Management',
    12,
    'Designed for those interested in starting their own business, exposing students to the basics of entrepreneurship, including design thinking, customer assessment, problem solving, financing, and leveraging resources.',
    '["Develop a business plan outlining the viability and sustainability of an idea","Create a value proposition and test market assumptions for a business idea","Apply standard accounting practices and evaluate finance opportunities"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-50', 'Introduction to Entrepreneurship', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Designed for those interested in starting their own business, either as their primary income or extra income, including individual contributor businesses such as freelancers, contractors, consultants, and others in the gig economy. The curriculum is centered on three key aspects of entrepreneurship: 1) the individual, their traits, skills, and attributes that make entrepreneurs successful, 2) the business ideas, how to generate them, where to look for them, how to expand them, and 3) how to ensure they are valid business ideas with potential to meet profit goals. These elements, developed in the course, will assist any current or potential entrepreneur develop and grow a business now or in the future. 54.00 hours lecture. (Letter grade only)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-51', 'Entrepreneurship Basics', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Entrepreneurship has been described as the capacity and willingness to develop, organize and manage a business venture along with any of its risks in order to make a profit. This course will expose students to the basics of entrepreneurship, including design thinking, customer assessment, and problem solving. Additionally, students will focus on lean market strategies for testing product/service validity. 54.00 hours lecture. (Letter grade', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-52', 'Starting a Business with Limited Resources', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Entrepreneurs start and grow businesses in home offices, garages, and even on public transportation using a laptop or smartphone. Social media and technology have leveled the playing field for the ordinary person wanting to become an entrepreneur. These entrepreneurs are finding creative ways of starting businesses in spite of limited networks and financial resources. This course will introduce students to bootstrapping (limited-resource startup concepts and strategies), social media strategies and platforms, cybersecurity, and tactics to launch their business or expand their reach. Students will experience entrepreneurial situations and best practices through case studies, interactive sessions, and class exercises. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-53', 'Money, Finance and Accounting for Entrepreneurs', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'One of the more challenging aspects of entrepreneurship deals with financing. Determine how much you need and how entrepreneurial finance works: where, when, and how to get financing, equity, bootstraps, angel investors and venture capitalists. Learn the critical importance of leveraging resources. Discover what you really need to know about bookkeeping, accounting, and using numbers to make smarter decisions. 54.00 hours lecture. (Letter grade only)', false, NULL, 3
    );
  END IF;

  -- ── Entrepreneurial Foundations ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'entrepreneurial-foundations',
    'Entrepreneurial Foundations',
    'Certificate of Achievement',
    'School of Business & Management',
    15,
    'Designed for those interested in starting their own business, exposing students to the basics of entrepreneurship including design thinking, customer assessment, problem solving, financing, and leveraging resources. Utilizes the Business Model Canvas technique.',
    '["Develop a comprehensive business plan outlining the viability and sustainability of an idea","Apply standard accounting practices and evaluate finance opportunities","Create a Business Model Canvas showcasing main components and deliver a compelling presentation"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-50', 'Introduction to Entrepreneurship', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Designed for those interested in starting their own business, either as their primary income or extra income, including individual contributor businesses such as freelancers, contractors, consultants, and others in the gig economy. The curriculum is centered on three key aspects of entrepreneurship: 1) the individual, their traits, skills, and attributes that make entrepreneurs successful, 2) the business ideas, how to generate them, where to look for them, how to expand them, and 3) how to ensure they are valid business ideas with potential to meet profit goals. These elements, developed in the course, will assist any current or potential entrepreneur develop and grow a business now or in the future. 54.00 hours lecture. (Letter grade only)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-51', 'Entrepreneurship Basics', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Entrepreneurship has been described as the capacity and willingness to develop, organize and manage a business venture along with any of its risks in order to make a profit. This course will expose students to the basics of entrepreneurship, including design thinking, customer assessment, and problem solving. Additionally, students will focus on lean market strategies for testing product/service validity. 54.00 hours lecture. (Letter grade', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-53', 'Money, Finance and Accounting for Entrepreneurs', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'One of the more challenging aspects of entrepreneurship deals with financing. Determine how much you need and how entrepreneurial finance works: where, when, and how to get financing, equity, bootstraps, angel investors and venture capitalists. Learn the critical importance of leveraging resources. Discover what you really need to know about bookkeeping, accounting, and using numbers to make smarter decisions. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-54', 'ENP-54', 3, 1, 'Spring',
      'core', NULL, '[]'::jsonb,
      NULL, false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-55', 'Entrepreneurial Simulation - Capstone', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Challenges students to apply entrepreneurial strategies and concepts to the development of a business. Students will employ strategic planning, communication, conflict management and negation, team-building, creative problem solving, self-management, resourcing, and operating a small business. Student entrepreneurs will be challenged with the opportunity of assembling a complete start-up utilizing the tools and concepts from all previous entrepreneurship courses in a competency-based computer simulation. 54.00 hours lecture. (Letter grade', false, NULL, 4
    );
  END IF;

  -- ── Entrepreneurship: Getting Started ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'entrepreneurship-getting-started',
    'Entrepreneurship: Getting Started',
    'Certificate of Achievement',
    'School of Business & Management',
    10,
    'Includes courses intended to help students interested in pursuing entrepreneurship develop new ideas, recognize and take advantage of opportunities, as a foundation for creating a new business.',
    '["Demonstrate an understanding of the entrepreneurial process from idea generation to commercialization","Analyze and evaluate potential business ideas for marketability and success","Create and evaluate a comprehensive business plan","Outline and construct steps needed to create an effective social marketing campaign for a small business"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-30', 'Entrepreneurship: Foundations and Fundamentals', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introductory course designed to explore, identify and evaluate business opportunities with an emphasis on starting and managing a small or existing business: investigating tools and best practices associated with identifying and creating new venture opportunities; explore ways to shape and evaluate the viability of opportunities; understanding key industry factors, market, competitive factors, and customer needs. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-14', 'BUS-14', 3, 1, 'Fall',
      'core', NULL, '[]'::jsonb,
      NULL, false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-12', 'Opportunity Analysis for Entrepreneurs', 2, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'This course examines the entrepreneur''s role in the global economy as an exploiter of opportunities. Topics include the creative search for ideas, the innovation process, and the opportunity analysis to screen for the best ideas. Learning activities cover the decisions needed to transform an idea into a business opportunity. 36.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-13', 'Developing a Successful Business Plan/Model', 2, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'This course provides a systematic process for developing a business plan or model. It establishes a clear road map for clarifying a vision for a business and the strategic, tactical, and operational plans and/or model to move ideas into action. Students further along in the planning and research process will work through the major components of writing a business plan and/or model and emerge with a completed draft of a business plan/model. 36.00 hours lecture. (Letter grade only)', false, NULL, 3
    );
  END IF;

  -- ── Entrepreneurship and the Team ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'entrepreneurship-and-the-team',
    'Entrepreneurship and the Team',
    'Certificate of Achievement',
    'School of Business & Management',
    18,
    'Designed for those interested in starting their own business, exposing students to the basics of entrepreneurship. Utilizes the Business Model Canvas technique and provides critical insights into founding-team formation, the Gig economy, legal business structures, e-commerce, and networks.',
    '["Develop a business plan outlining the viability and key elements in establishing business partnerships","Apply standard accounting practices and evaluate finance opportunities","Create a Business Model Canvas and deliver a compelling presentation","Demonstrate the principles of the Gig Economy and recognize different types of entrepreneurial categories"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-50', 'Introduction to Entrepreneurship', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Designed for those interested in starting their own business, either as their primary income or extra income, including individual contributor businesses such as freelancers, contractors, consultants, and others in the gig economy. The curriculum is centered on three key aspects of entrepreneurship: 1) the individual, their traits, skills, and attributes that make entrepreneurs successful, 2) the business ideas, how to generate them, where to look for them, how to expand them, and 3) how to ensure they are valid business ideas with potential to meet profit goals. These elements, developed in the course, will assist any current or potential entrepreneur develop and grow a business now or in the future. 54.00 hours lecture. (Letter grade only)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-51', 'Entrepreneurship Basics', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Entrepreneurship has been described as the capacity and willingness to develop, organize and manage a business venture along with any of its risks in order to make a profit. This course will expose students to the basics of entrepreneurship, including design thinking, customer assessment, and problem solving. Additionally, students will focus on lean market strategies for testing product/service validity. 54.00 hours lecture. (Letter grade', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-53', 'Money, Finance and Accounting for Entrepreneurs', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'One of the more challenging aspects of entrepreneurship deals with financing. Determine how much you need and how entrepreneurial finance works: where, when, and how to get financing, equity, bootstraps, angel investors and venture capitalists. Learn the critical importance of leveraging resources. Discover what you really need to know about bookkeeping, accounting, and using numbers to make smarter decisions. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-54', 'ENP-54', 3, 1, 'Spring',
      'core', NULL, '[]'::jsonb,
      NULL, false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-70', 'Building an Entrepreneurial Team', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'The composition of the entrepreneurial founding team can be an important indicator of future revenue and project success. Provides critical insights into the often overlooked basics of founding-team formation. Why are some motivations of the team more profitable than others? This course covers finding the right hires for your team and common mistakes in hiring key players. Upon successful completion of this course, students will be better prepared to position their start-up for success by making evidence-based decisions about founding partners, early hires, first managers, and distribution of ownership. 54.00 hours lecture. (Letter grade only)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ENP-71', 'Solopreneurship', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Business opportunities develop in many forms, from sole-proprietors to corporations. A new and growing entity is the Solopreneur. This course will discuss the differences between the many types of solopreneurs such as freelancer, nomadic, and self-employed business owners. Students will learn about the Gig economy, legal business structures, e-commerce, networks, and key relationships. 54.00 hours lecture. (Letter grade only)', false, NULL, 5
    );
  END IF;

  -- ── Entrepreneurship: Legal & Finance ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'entrepreneurship-legal-finance',
    'Entrepreneurship: Legal & Finance',
    'Certificate of Achievement',
    'School of Business & Management',
    10,
    'Includes courses intended to help students interested in pursuing entrepreneurship develop skills in financing, legal issues, and applied accounting and bookkeeping for the small business.',
    '["Demonstrate an understanding of the entrepreneurial process from idea generation to commercialization","Apply accounting and bookkeeping for small business principles","Analyze and evaluate various funding sources for small businesses","Outline and evaluate the legal steps and issues necessary for opening a small business"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-30', 'Entrepreneurship: Foundations and Fundamentals', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introductory course designed to explore, identify and evaluate business opportunities with an emphasis on starting and managing a small or existing business: investigating tools and best practices associated with identifying and creating new venture opportunities; explore ways to shape and evaluate the viability of opportunities; understanding key industry factors, market, competitive factors, and customer needs. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-55', 'Applied Accounting/Bookkeeping', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introductory course for students who are non-accounting majors. Basic bookkeeping and accounting principles for both merchandising and service-oriented small business enterprises. Emphasis on the development of skills to record business transactions for cash and accrual methods, as well as the procedures to prepare financial statements and complete an accounting cycle. Attention is given to special journals, subsidiary ledgers, and payroll and banking procedures. 54.00 hours lecture. (Same as CAT-55) (Letter grade or Pass/No Pass option)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-31', 'Financing Your Business', 2, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'The importance and impact of funding sources for entrepreneurial ventures. Topics include reviewing the impact of venture capital, identifying funding sources, raising money, and writing funding agreements and proposals. 36.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-33', 'Business Structure and Legal Issues', 2, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'This course examines the primary forms of business structures, such as sole proprietorship, partnership, and corporation, and the legal elements needed to comply with regulations and guidelines of various governmental agencies. The course will help entrepreneurs recognize the legal issues before they become problems, select legal representation, and manage and grow businesses more effectively within the law. 36.00 hours lecture. (Letter grade only)', false, NULL, 3
    );
  END IF;

  -- ── Logistics Management ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'logistics-management',
    'Logistics Management',
    'A.S. Degree | Certificate of Achievement',
    'School of Business & Management',
    18,
    'Prepares students for entry into or career growth within the logistics industry. Focuses on integrated logistics, a necessity for management of effective and efficient supply chains, covering warehousing, transportation, service contracting, purchasing, and global logistics.',
    '["Compare roles and objectives of the logistics disciplines","Understand how logistics functions interact to efficiently use total personnel, facilities, and equipment","Explain how the overall flow of goods, services, and information can be optimized to satisfy customer and business goals","Describe roles and value added by global logistics intermediaries"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-80', 'Principles of Logistics', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the management of business logistics functions including purchasing, inventory management, transportation, warehousing, and their related technologies. Focus is on integration of logistics functions to improve overall supply chain customer service and cost performance. 54.00 hours lecture. (Letter grade', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-82', 'Freight Claims', 1.5, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'A study of loss avoidance and mitigation in transit and of the preparation, filing, and resolution. 27.00 hours lecture. (Letter grade or Pass/No Pass option)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-83', 'Contracts', 1.5, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'A study of the legal and regulatory requirements applicable to contracts for product transportation and logistics functions and considerations for drafting and negotiating contracts with freight carriers, warehouses and other logistics service providers. 27.00 hours lecture. (Letter grade or Pass/No Pass option)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-85', 'Warehouse Management', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Introduction to an integrated logistics approach to warehouse management. Includes the role of warehousing within the supply chain, performance metrics, applicable leadership basics, how to interact with other logistics managers to optimize overall activity, as well as principles of warehouse location, design, layout, operating functions, and customer service. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-86', 'Transportation and Traffic Management', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'A study of the freight transportation system including the demand for freight movement, laws, regulations, pricing, and policies, traffic management and international transportation issues. Focuses on how transportation collaborates with other supply chain functions to optimize cost and customer service. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-87', 'Purchasing and Supply Management', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Study of the purchasing and supply manager''s responsibilities including the identification, acquisition, positioning and management of materials, services and equipment that organizations needs to attain their goals. Emphasis is on decision making, integration with suppliers, critical internal relationships, and customer (end user) service. 54.00 hours lecture. (Letter grade or Pass/No Pass', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-90', 'International Logistics', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the role of logistics in global business; including the economic and service characteristics of international transportation providers, the government''s role, documentation and terms of sale used in global business, and the fundamentals of effective export and import management. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', false, NULL, 6
    );
  END IF;

  -- ── Real Estate: Salesperson & Transactions ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'real-estate-salesperson-transactions',
    'Real Estate: Salesperson & Transactions',
    'Locally Approved Certificate',
    'School of Business & Management',
    9,
    'Prepares students to buy, sell, and lease residential and commercial real estate property. Prepares students to qualify for the California Real Estate Salesperson license and to successfully take the California Real Estate Salesperson exam.',
    '["Analyze ethical and procedural problems that arise in real estate transactions","Discuss and evaluate real estate marketing and sales techniques","Explain and evaluate methods of financing and evaluating real estate","Demonstrate knowledge of state and federal statutes and regulations affecting real estate sales"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'RLE-80', 'Real Estate Principles', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Basic laws and principles of California real estate; fundamentals, terminology, concepts, current practices, and current market trends in real estate. Assists those preparing for the real estate sales person and broker license examination. 54.00 hours lecture. (Letter grade', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'RLE-81', 'Real Estate Practices', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Covers basic laws and principles of California real estate, terminology, and daily operations in a real estate brokerage, including listing, prospecting, advertising, financing, sales techniques, escrow, and ethics. Applies towards the State’s educational requirements for the Brokers examination. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'RLE-82', 'Legal Aspects of Real Estate', 3, 1, 'Fall',
      'elective', 'None.', '[]'::jsonb,
      'Introduction to California real estate law, including rights incident to property ownership and management, agency, contracts, and application to real estate transfer, conveyance, probate proceedings, trust deeds, and foreclosure, as well as recent legislation governing real estate transactions. Applies toward educational requirement of brokers examination. 54.00 hours lecture. (Letter grade only)', true, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'RLE-83', 'Real Estate Finance', 3, 1, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'Analysis of real estate financing, including lending policies and problems in financing transactions in residential, apartment, commercial, and special purpose properties. Methods of financing properties emphasized. 54.00 hours lecture. (Letter grade only)', true, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'RLE-85', 'Real Estate Economics', 3, 1, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'Trends and factors affecting the value of real estate; the nature and classification of land economics; the development of property, construction and subdivision, economic values and real estate evaluation; real estate cycles and business fluctuations, residential market trends, real and special purpose property trends. 54.00 hours lecture. (Letter grade only)', true, NULL, 4
    );
  END IF;

  -- ── Registered Income Tax Preparer ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'registered-income-tax-preparer',
    'Registered Income Tax Preparer',
    'Locally Approved Certificate',
    'School of Business & Management',
    4,
    'U.S. and California income tax principles and tax return preparation as it relates to individuals, sole proprietorships, and other business entities. This course is certified by the California Tax Education Council (CTEC) as fulfilling the 60-hour qualifying education requirement for becoming a Registered Tax Preparer.',
    '["Prepare federal and state income tax returns for individuals, sole proprietorships, and other business entities","Conduct tax research on client issues using manual and computerized methods","Evaluate and propose strategies that minimize income tax obligations"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-67', 'U.S. and California Income Tax Preparation', 4, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'U.S. and California income tax principles and tax return preparation as it relates to individuals, sole proprietorships, and other business entities. This course is certified by the California Tax Education Council (CTEC) as fulfilling the 60-hour qualifying education requirement imposed by the State of California for becoming a Registered Tax Preparer. 72.00 hours lecture. (Letter grade', false, NULL, 0
    );
  END IF;

  -- ── Retail Management WAFC ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'retail-management-wafc',
    'Retail Management WAFC',
    'A.S. Degree | Certificate of Achievement',
    'School of Business & Management',
    30,
    'Prepares individuals to perform operations associated with retail sales in a variety of settings. Includes instruction in direct sales operations, basic bookkeeping principles, customer service, team/staff leadership and supervision, floor management, and applicable technical skills.',
    '["Use GAAP guidelines to review and interpret financial documents","Calculate pricing models for mark-ups, profit margins, discounts, and sinking funds","Prepare and deliver effective oral and written communications through multiple modes","Analyze the effectiveness of marketing decisions and use marketing principles to assess market potential"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-1A', 'Principles of Accounting I', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to accounting principles and practice, as a manual and/or computerized information system that provides and interprets economic data for economic units within a global society. Includes recording, analyzing, and summarizing procedures used in preparing financial statements. 54.00 hours lecture. (Letter grade', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-20', 'Business Mathematics', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to quantitative approaches for solving common business problems using general mathematics and first degree equations. Includes the development and solution of problems in the areas of business statistics, trade and cash discounts, markups and markdowns, perishables, payroll, taxes, simple interest, promissory notes, compound interest, present and future value, annuities and sinking funds, installment buying and credit cards, home ownership costs, insurance, stocks and bonds, mutual funds, financial reports, depreciation, inventory, and overhead. 54.00 hours lecture. (Letter grade', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'BUS-22', 'Management Communications', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Examines the dynamics of organizational communication relevant in current business environment. Focus is on composition and delivery of appropriate methods of communication in various business situations as a manager, including business documents, presentations, and job interviews. Practical experience is attained in verbal/non-verbal and written communication skills that fosters growth and advancement in business opportunities. Best suited for those aspiring to advance their careers by being prepared to be potential managers and leaders. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CIS-1A', 'Introduction to Computer Information Systems', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Examination of information systems and their role in business. Focus on information systems, database management systems, networking, e-commerce, ethics and security, computer systems hardware and software components. Application of these concepts and methods through hands-on projects developing computer-based solutions to business problems. Utilizing a systems approach students will use databases, spreadsheets, word processors, presentation graphics, and the Internet to solve business problems and communicate solutions. 54.00 hours lecture and 18.00 hours laboratory. (TBA Option) (Letter grade only)', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MAG-56', 'HRM: Human Resources Management', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Examines the manager’s responsibility for implementing human resources applications involving the selection, training, evaluation, motivation and promotion of personnel. Compares and contrasts alternatives leading to innovative and socially responsible solutions to current employee relations issues with the workplace. 54.00 hours lecture. (Letter grade only)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MAG-44', 'Principles of Management', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'For those who are in management, preparing for a potential promotion, or interested in the management process. Includes the primary functions of planning, organizing, controlling, and leading as well as related skills such as team development, motivation and communication techniques, and quality management. Also, social responsibility and a global perspective are emphasized. 54.00 hours lecture. (Letter grade only)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MAG-53', 'Human Relations', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'A practical application of basic psychology in building better employer-employee relationships. Examines effective human relation techniques. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', false, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MKT-20', 'Principles of Marketing', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Examines the role of marketing as it relates to society and economic development. The course will analyze products, consumer, marketing research, and strategic market planning. The course will survey, with a global perspective, the selection of target markets as well as the development of the marketing mix – place, product, price, and promotion. 54.00 hours lecture. (Letter grade', false, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MKT-42', 'Retail Management', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An overview of management philosophies, strategies and practices regarding offline and online retail stores. Explores merchandising, location selection, operations, and customer service/retention aspects of retailing. 54.00 hours lecture. (Letter grade only)', false, NULL, 8
    );
  END IF;

  -- ── Small Business Accounting ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'small-business-accounting',
    'Small Business Accounting',
    'Locally Approved Certificate',
    'School of Business & Management',
    6,
    'Trains students to perform the basic duties and responsibilities required of an entry-level accounting clerk or bookkeeper utilizing accounting software.',
    '["Perform a variety of accounting skills such as journalizing, posting, and double entry accounting","Use accounting software to prepare financial statements and analyze problems","Recognize the role of ethics in accounting"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-65', 'QuickBooks Accounting', 3, 1, 'Fall',
      'core', 'ACC 1A or ACC 55', '[]'::jsonb,
      'An introduction to QuickBooks Accounting Software, which integrates accounting principles, transactions, and events using their automated system relating to both service and merchandising companies. Students learn to record and process accounting transactions and events using up-to-date software that prepares them for actual situations that relate to the creation of a company, working with customers and vendors, posting sales receipts and payments, managing inventory and budgets, as well as customizing and extending QuickBooks software capabilities. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-1A', 'Principles of Accounting I', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to accounting principles and practice, as a manual and/or computerized information system that provides and interprets economic data for economic units within a global society. Includes recording, analyzing, and summarizing procedures used in preparing financial statements. 54.00 hours lecture. (Letter grade', false, NULL, 1
    );
  END IF;

  -- ── Small Business Payroll Accounting ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'small-business-payroll-accounting',
    'Small Business Payroll Accounting',
    'Locally Approved Certificate',
    'School of Business & Management',
    6,
    'Trains students to perform the basic duties and responsibilities required of an entry-level payroll accounting clerk.',
    '["Analyze and evaluate payroll principles as defined by Social Security Act and laws relating to payment of wages","Analyze and solve problems associated with calculation and reporting of payroll","Accurately apply accounting principles to computerized and manual payroll systems"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-62', 'Payroll Accounting', 3, 1, 'Fall',
      'core', 'ACC 1A or ACC 55 or CAT 55', '[]'::jsonb,
      'Covers accounting for payroll and examines aspects of the Social Security Act, California Unemployment Insurance Act, and the California Worker''s Compensation Insurance Act. Payroll principles applied through the use of microcomputers. 54.00 hours lecture. (Letter grade or Pass/No Pass option)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ACC-1A', 'Principles of Accounting I', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to accounting principles and practice, as a manual and/or computerized information system that provides and interprets economic data for economic units within a global society. Includes recording, analyzing, and summarizing procedures used in preparing financial statements. 54.00 hours lecture. (Letter grade', false, NULL, 1
    );
  END IF;

  -- ── Crime Scene Investigation ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'crime-scene-investigation',
    'Crime Scene Investigation',
    'Certificate of Achievement',
    'School of Human & Public Services',
    21,
    'Provides a strong academic and skill-building pattern of coursework to prepare participants to enter the professional field with academic and technical knowledge in forensic and criminal investigative techniques used within crime scene investigations.',
    '["Demonstrate advanced knowledge in the components of criminal law and the criminal justice system","Analyze and demonstrate advanced knowledge in Constitutional criminal law, civil rights, and rules of evidence","Demonstrate a proficient level of knowledge in evidence identification, collection, preservation, and chain of custody","Understand basic and intermediate forensic science principles and techniques"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ADJ-2', 'Principles and Procedures of the Justice System', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An examination and analysis of due process in criminal proceedings from pre-arrest through trial and appeal utilizing statutory law and state and constitutional precedents. 54.00 hours lecture. (Letter grade only)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ADJ-3', 'Concepts of Criminal Law', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Criminal law is the study of the causes, consequences and control of crime. This course covers the historical development, philosophy of law and constitutional provisions and offers an analysis of the doctrines of criminal liability in the United States and the classification of crimes against persons, property, morals, and public welfare. Special emphasis is placed on the classification of crime, the general elements of crime, the definitions of common and statutory law, and the nature of acceptable evidence. This course utilizes case law and case studies to introduce students to criminal law. The completion of this course offers a foundation upon which upper-division criminal justice course will build. Students may not receive credit for ADJ-3 and ADJ-3H. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ADJ-4', 'Legal Aspects of Evidence', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Origin, development, philosophy, and constitutional basis of evidence; constitutional and procedural considerations affecting arrest, search and seizure; kinds and degrees of evidence and rules governing admissibility; judicial decisions interpreting individual rights and case studies. 54.00 hours lecture. (Letter grade', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ADJ-12', 'Introduction to Criminalistics', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the role of criminalistics and forensic science in criminal investigations. Focuses on forensic science and scientific processing and analysis of forensic evidence, including pattern evidence, biological evidence, forensic biometrics evidence, trace evidence, weapons evidence, ballistics and tool mark evidence, questioned document evidence, forensic toxicology, controlled substances evidence, and digital and mobile devices evidence. The methods utilized in the forensic analysis of criminal and crime scene investigation, including crime lab methods, instrumentation, policies, and procedures. Includes legal aspects of forensic evidence analysis and documentation. 54.00 hours lecture. (Letter grade only)', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ADJ-13', 'Criminal Investigation', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Fundamentals of criminal investigations from initial report/discovery through adjudication. Establishing statutory elements of criminal acts, initial law enforcement and public safety investigative response, jurisdiction, multijurisdictional investigations, evidence identification and collection, criminal intelligence collection and analysis, open-source intelligence and investigative informational sources, modus operandi, discussion and identification of general and specialized criminal investigations, case preparation, and adjudication. 54.00 hours lecture. (Letter grade only)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ADJ-14', 'Advanced Criminal Investigation', 3, 2, 'Fall',
      'core', 'ADJ 13', '[]'::jsonb,
      'Advanced training and skill development in crime scene investigation and in the recording, collection, and preservation of physical and testimonial evidence. Focus in on the understanding and working knowledge of fingerprints, ballistics firearms identification, varieties of trace evidence and a basic introduction to forensic sciences. 54.00 hours lecture and 12.00 hours laboratory. (Letter grade only)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ADJ-27', 'Forensic & Crime Scene Photography', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'The theory and practice of forensic and crime scene photography, with a specific focus upon the proficiency and development of technical photography skills in legal and field environments. Students will obtain an introduction to the basic principles of photography and significant academic and technical exposure and skillbuilding in forensic photography, with a focus upon photographic documentation of forensic environments, including crime scene photography, injury documentation, traffic collision and property damage, evidence photography, forensic light source photography, low light/ nighttime scene photography, specialized crime scene photography, and proper and lawful photographic evidence collection. A comprehensive review of academic legal knowledge regarding the rules of evidence and crime scene investigation techniques as it relates to crime scene photography. 36.00 hours lecture and 54.00 hours laboratory. (Same as PHO-27) (Letter grade only)', false, NULL, 6
    );
  END IF;

  -- ── Early Childhood Education ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'early-childhood-education',
    'Early Childhood Education',
    'A.S. Degree | Certificate of Achievement',
    'School of Human & Public Services',
    31,
    'Provides an educational and practical foundation for students interested in working with children from infancy through third grade. Offers practical skills and on-site training that will prepare students for employment in the field of Early Childhood Education and fulfills required child development coursework for the state-issued Child Development Permit.',
    '["Develop, implement, and evaluate developmentally appropriate curriculum for children who are typical and atypical","Develop and apply appropriate practices that respect the cultural diversity of young children and their families","Integrate an educational philosophy into classroom practices that reflects a personal belief supportive of theoretical principles","Develop and implement a system of ongoing observational practices that adapts to the evolving needs of children"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-19', 'EAR-19', 3, 1, 'Fall',
      'core', NULL, '[]'::jsonb,
      NULL, false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-20', 'Child Growth and Development', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'This introductory course examines the major physical, psychosocial, and cognitive/language developmental milestones for children, both typical and atypical, from conception through adolescence. Emphasis on interactions between maturational processes and environmental factors. While studying developmental theory and investigative research methodologies, students will observe children, evaluate individual differences, and analyze characteristics of development at various stages, and the importance of play. Child observations required. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-24', 'Introduction to Curriculum', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An overview of knowledge and skills related to providing appropriate curriculum and environments for young children. Students will examine a teacher''s role in supporting development and engagement for all young children. Provides strategies for developmentallyappropriate practice based on observation and assessments across the curriculum, including: academic content areas; play, art, and creativity; and development of social-emotional, communication, and cognitive skills. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-25', 'Teaching in a Diverse Society', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Examines the impact of various societal influences on children’s development, personal and social identity, and school experiences. Becoming aware of difference and diversity to become culturally competent members of a diverse society. Covers developmentally appropriate, inclusive, culturally relevant, linguistically appropriate and anti-bias, anti-racist approaches. Selfexamination and reflection on issues related to social identity, stereotypes, and bias will be explored. 54.00 hours lecture. (Letter grade only)', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-26', 'Health, Safety and Nutrition', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the laws, regulations, standards, policies, procedures, and best practices related to health, safety, and nutrition in care and education settings for children birth through middle childhood. Covering the mental health, and safety for both children and staff will be identified along with the importance of collaboration with families and health professionals. Includes the teacher and classroom staff’s role in prevention strategies, nutrition and meal planning, integrating health safety and nutrition experiences into daily routines, and overall risk management. 54.00 hours lecture. (Letter grade only)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-28', 'Principles and Practices of Teaching Young Children', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Historical contexts and theoretical perspectives of developmentally appropriate practice in early care and education for children birth through age eight, emphasizing the key role of relationships, and constructive adult-child interactions. Explores the professional identity, typical roles and expectations of early childhood educators. Identifies professional ethics, career pathways, promoting advocacy, professional standards. Introduces best practices for developmentally appropriate learning environments, curriculum, and effective pedagogy for young children, including how play contributes to children''s learning, growth, and development. 54.00 hours lecture. (Letter grade only)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-30', 'Practicum in Early Childhood Education', 4, 2, 'Fall',
      'core', 'EAR 20 and EAR 24 and EAR 28 and EAR 42', '[]'::jsonb,
      'Students will demonstrate developmentally appropriate early childhood program planning and teaching competencies, under the supervision of ECE/CD faculty and other qualified early education professionals. Students will utilize practical classroom experiences to make connections between theory and practice, develop professional behaviors, and build a comprehensive understanding of children and families. Child-centered, play-oriented approaches to teaching, learning, and assessment; and knowledge of curriculum content areas will be emphasized as student teachers design, implement and evaluate experiences that promote positive development and learning for all young children. Reflective practice will be emphasized as student teachers design, implement, and evaluate approaches, strategies, and techniques that promote development and learning for children from varied backgrounds and experiences. Includes exploration of career pathways, professional development, and teacher responsibilities. 36.00 hours lecture and 108.00 hours laboratory. (Letter grade only)', false, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-42', 'Child, Family, and Community', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'The processes of socialization focusing on the interrelationship of family, school, and community. Examines the influence of multiple societal contexts. Explores the role of collaboration between family, community, and schools in supporting children’s development, birth through adolescence. 54.00 hours lecture. (Letter grade only)', false, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-23', 'EAR-23', 3, 2, 'Fall',
      'elective', NULL, '[]'::jsonb,
      NULL, true, NULL, 8
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-33', 'Infant and Toddler Development', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'A study of infants and toddlers from preconception to age three including physical, cognitive, language, social, and emotional growth and development. Applies theoretical frameworks to interpret behavior and interactions between heredity and environment. Emphasizes the role of family and relationships in development. 54.00 hours lecture. (Letter grade only)', true, NULL, 9
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-40', 'Introduction to Children with Special Needs', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'Introduces variations in development of children with special needs ages birth through eight and the resulting impact on families. Includes an overview of historical and societal influences, laws relating to children with special needs, and the identification and referral process. This course will include required observations of programs for infants and children with special needs and their families. 54.00 hours lecture. (Letter grade only)', true, NULL, 10
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-43', 'Children with Challenging Behaviors', 3, 2, 'Spring',
      'elective', 'EAR 20', '[]'::jsonb,
      'An overview of the developmental, environmental and cultural factors that impact the behavior of young children, including family stressors, child temperament, violence, attachment disorders, and special needs; and proactive intervention and prevention techniques. Topics include addressing reasons children misbehave, how to carefully observe a child, how to create a positive environment to encourage appropriate behavior, and how to effectively address many types of behaviors including those that are aggressive and antisocial, disruptive, destructive, emotional and dependent. Outside observations required. 54.00 hours lecture. (Letter grade', true, NULL, 11
    );
  END IF;

  -- ── Early Childhood Education Assistant ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'early-childhood-education-assistant',
    'Early Childhood Education Assistant',
    'Certificate',
    'School of Human & Public Services',
    6,
    'Enables the holder to care for and assist in the development and instruction of children in a child development program while under supervision. Students select two courses from EAR 20, 24, 28, and 42.',
    '["Demonstrate an understanding of the theoretical perspectives in human development and education","Appraise the role of the child as an active learner","Integrate child growth and development into practical and meaningful applications"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-20', 'Child Growth and Development', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'This introductory course examines the major physical, psychosocial, and cognitive/language developmental milestones for children, both typical and atypical, from conception through adolescence. Emphasis on interactions between maturational processes and environmental factors. While studying developmental theory and investigative research methodologies, students will observe children, evaluate individual differences, and analyze characteristics of development at various stages, and the importance of play. Child observations required. 54.00 hours lecture. (Letter grade only)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-24', 'Introduction to Curriculum', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An overview of knowledge and skills related to providing appropriate curriculum and environments for young children. Students will examine a teacher''s role in supporting development and engagement for all young children. Provides strategies for developmentallyappropriate practice based on observation and assessments across the curriculum, including: academic content areas; play, art, and creativity; and development of social-emotional, communication, and cognitive skills. 54.00 hours lecture. (Letter grade only)', true, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-28', 'Principles and Practices of Teaching Young Children', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Historical contexts and theoretical perspectives of developmentally appropriate practice in early care and education for children birth through age eight, emphasizing the key role of relationships, and constructive adult-child interactions. Explores the professional identity, typical roles and expectations of early childhood educators. Identifies professional ethics, career pathways, promoting advocacy, professional standards. Introduces best practices for developmentally appropriate learning environments, curriculum, and effective pedagogy for young children, including how play contributes to children''s learning, growth, and development. 54.00 hours lecture. (Letter grade only)', true, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-42', 'Child, Family, and Community', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'The processes of socialization focusing on the interrelationship of family, school, and community. Examines the influence of multiple societal contexts. Explores the role of collaboration between family, community, and schools in supporting children’s development, birth through adolescence. 54.00 hours lecture. (Letter grade only)', true, NULL, 3
    );
  END IF;

  -- ── Early Childhood Education: Intervention Assistant ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'early-childhood-education-intervention-assistant',
    'Early Childhood Education: Intervention Assistant',
    'A.S. Degree | Certificate of Achievement',
    'School of Human & Public Services',
    34,
    'Appropriate for students interested in working as an assistant or paraprofessional in early intervention, early childhood special education, and community child development programs serving children with special needs. Provides practical skills and on-site training for employment in Early Childhood Intervention.',
    '["Demonstrate an understanding of family function and structure along with familial need for information and support that respects diverse cultures","Demonstrate basic knowledge of laws and regulations pertaining to and protecting children with disabilities","Describe typical child development milestones and identify strengths and special needs of the child","Demonstrate understanding of the purpose and intent of an inclusive environment supporting children with disabilities"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-19', 'EAR-19', 3, 1, 'Fall',
      'core', NULL, '[]'::jsonb,
      NULL, false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-20', 'Child Growth and Development', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'This introductory course examines the major physical, psychosocial, and cognitive/language developmental milestones for children, both typical and atypical, from conception through adolescence. Emphasis on interactions between maturational processes and environmental factors. While studying developmental theory and investigative research methodologies, students will observe children, evaluate individual differences, and analyze characteristics of development at various stages, and the importance of play. Child observations required. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-24', 'Introduction to Curriculum', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An overview of knowledge and skills related to providing appropriate curriculum and environments for young children. Students will examine a teacher''s role in supporting development and engagement for all young children. Provides strategies for developmentallyappropriate practice based on observation and assessments across the curriculum, including: academic content areas; play, art, and creativity; and development of social-emotional, communication, and cognitive skills. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-28', 'Principles and Practices of Teaching Young Children', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Historical contexts and theoretical perspectives of developmentally appropriate practice in early care and education for children birth through age eight, emphasizing the key role of relationships, and constructive adult-child interactions. Explores the professional identity, typical roles and expectations of early childhood educators. Identifies professional ethics, career pathways, promoting advocacy, professional standards. Introduces best practices for developmentally appropriate learning environments, curriculum, and effective pedagogy for young children, including how play contributes to children''s learning, growth, and development. 54.00 hours lecture. (Letter grade only)', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-40', 'Introduction to Children with Special Needs', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Introduces variations in development of children with special needs ages birth through eight and the resulting impact on families. Includes an overview of historical and societal influences, laws relating to children with special needs, and the identification and referral process. This course will include required observations of programs for infants and children with special needs and their families. 54.00 hours lecture. (Letter grade only)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-41', 'Practicum in Early Intervention/Special Education', 4, 1, 'Spring',
      'core', 'EAR 20 and EAR 24 and EAR 28 and EAR 42', '[]'::jsonb,
      'Provides hands-on experience working with infants, toddlers and young children with special needs in a variety of early intervention and educational settings, including natural environments, self-contained special day and fully-included early childhood classrooms. Reflective practice is emphasized as student teachers design, implement, and evaluate approaches, strategies and techniques that promote development and learning. 36.00 hours lecture and 108.00 hours laboratory. (TBA Option) (Letter grade only)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-42', 'Child, Family, and Community', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'The processes of socialization focusing on the interrelationship of family, school, and community. Examines the influence of multiple societal contexts. Explores the role of collaboration between family, community, and schools in supporting children’s development, birth through adolescence. 54.00 hours lecture. (Letter grade only)', false, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-43', 'Children with Challenging Behaviors', 3, 2, 'Fall',
      'core', 'EAR 20', '[]'::jsonb,
      'An overview of the developmental, environmental and cultural factors that impact the behavior of young children, including family stressors, child temperament, violence, attachment disorders, and special needs; and proactive intervention and prevention techniques. Topics include addressing reasons children misbehave, how to carefully observe a child, how to create a positive environment to encourage appropriate behavior, and how to effectively address many types of behaviors including those that are aggressive and antisocial, disruptive, destructive, emotional and dependent. Outside observations required. 54.00 hours lecture. (Letter grade', false, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-46', 'Curriculum and Strategies for Children with Special Needs', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Covers curriculum and intervention strategies for working with children with special needs in partnership with their families. Focuses on the use of observation and assessment in meeting the individualized needs of children in inclusive and natural environments. Includes the role of the teacher as a professional working with families, collaboration with interdisciplinary teams, and cultural competence. 54.00 hours lecture. (Letter grade only)', false, NULL, 8
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-26', 'Health, Safety and Nutrition', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'An introduction to the laws, regulations, standards, policies, procedures, and best practices related to health, safety, and nutrition in care and education settings for children birth through middle childhood. Covering the mental health, and safety for both children and staff will be identified along with the importance of collaboration with families and health professionals. Includes the teacher and classroom staff’s role in prevention strategies, nutrition and meal planning, integrating health safety and nutrition experiences into daily routines, and overall risk management. 54.00 hours lecture. (Letter grade only)', true, NULL, 9
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-33', 'Infant and Toddler Development', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'A study of infants and toddlers from preconception to age three including physical, cognitive, language, social, and emotional growth and development. Applies theoretical frameworks to interpret behavior and interactions between heredity and environment. Emphasizes the role of family and relationships in development. 54.00 hours lecture. (Letter grade only)', true, NULL, 10
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-34', 'Infant and Toddler Care and Education', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'Applies current theory and research to the care and education of infants and toddlers in group settings. Examines essential policies, principles and practices that lead to quality care and developmentally appropriate curriculum for children birth to 36 months. 54.00 hours lecture. (Letter grade only)', true, NULL, 11
    );
  END IF;

  -- ── Early Childhood Education: Twelve Core Units ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'early-childhood-education-twelve-core-units',
    'Early Childhood Education: Twelve Core Units',
    'Certificate of Achievement',
    'School of Human & Public Services',
    12,
    'Prepares the holder to provide service in the care, development, and instruction of children in a child development program. The 12 core units form the foundation upon which further early childhood coursework is built.',
    '["Demonstrate an understanding of the theoretical perspectives in human development and education","Appraise the role of the child as an active learner","Integrate child growth and development into practical and meaningful applications"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-20', 'Child Growth and Development', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'This introductory course examines the major physical, psychosocial, and cognitive/language developmental milestones for children, both typical and atypical, from conception through adolescence. Emphasis on interactions between maturational processes and environmental factors. While studying developmental theory and investigative research methodologies, students will observe children, evaluate individual differences, and analyze characteristics of development at various stages, and the importance of play. Child observations required. 54.00 hours lecture. (Letter grade only)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-24', 'Introduction to Curriculum', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An overview of knowledge and skills related to providing appropriate curriculum and environments for young children. Students will examine a teacher''s role in supporting development and engagement for all young children. Provides strategies for developmentallyappropriate practice based on observation and assessments across the curriculum, including: academic content areas; play, art, and creativity; and development of social-emotional, communication, and cognitive skills. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-28', 'Principles and Practices of Teaching Young Children', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Historical contexts and theoretical perspectives of developmentally appropriate practice in early care and education for children birth through age eight, emphasizing the key role of relationships, and constructive adult-child interactions. Explores the professional identity, typical roles and expectations of early childhood educators. Identifies professional ethics, career pathways, promoting advocacy, professional standards. Introduces best practices for developmentally appropriate learning environments, curriculum, and effective pedagogy for young children, including how play contributes to children''s learning, growth, and development. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'EAR-42', 'Child, Family, and Community', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'The processes of socialization focusing on the interrelationship of family, school, and community. Examines the influence of multiple societal contexts. Explores the role of collaboration between family, community, and schools in supporting children’s development, birth through adolescence. 54.00 hours lecture. (Letter grade only)', false, NULL, 3
    );
  END IF;

  -- ── Computer Information Systems - Graphic Design ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'computer-information-systems-graphic-design',
    'Computer Information Systems - Graphic Design',
    'A.S. Degree | Certificate of Achievement',
    'School of Math, Engineering, Computer Science & Game Development',
    27,
    'Designed for students who wish to pursue training in desktop publishing. Training focuses on using a computer to design page layouts, develop presentations, and create advertising campaigns. Students learn to design, integrate, and format all forms of digital images into printable media.',
    '["Design and create images used for printed media in advertising web design","Apply techniques to create and modify artwork using vector-based and bit-mapped programs","Integrate text and graphics in a document layout program to create professional-quality full-color documents","Demonstrate knowledge of design principles in advertising and layout design, type, and lettering applications"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CIS-66', 'Web Development I', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the web technologies and languages. This course provides in depth understanding in the roles of markup and scripting languages to display text and multimedia content for basic web pages. Demonstrates the process by which the latest standard of HTML and construction of cascading style sheets frame generic content delivery. Functional extension is then applied through the use of Javascript and other relevant scripting languages, introducing dynamic functionality to web sites. Students will also become familiar with the use of web servers and file transfer protocol applications. 54.00 hours lecture and 18.00 hours laboratory. (Letter grade only)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CIS-72B', 'CIS-72B', 3, 1, 'Fall',
      'core', NULL, '[]'::jsonb,
      NULL, false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CIS-78A', 'Introduction to Adobe Photoshop', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Introduction to Adobe Photoshop including mastery of digital image editing, selections, photo correction, image improvement, and vector drawing. Additional instruction in these skills: type manipulation, special effects, color correction, and web page illustrations. 54.00 hours lecture and 18.00 hours laboratory. (TBA Option) (Same as CAT-78A) (Letter grade', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CAT-78B', 'CAT-78B', 3, 1, 'Fall',
      'core', NULL, '[]'::jsonb,
      NULL, false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CIS-79', 'Introduction to Adobe Illustrator', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Introduction to Adobe Illustrator, involving creating artwork for logos, illustrations, posters, perspective drawing and web content. Development of a working knowledge of creating graphic images and typography along with color use. 54.00 hours lecture and 18.00 hours laboratory. (TBA Option) (Same as CAT-79) (Letter grade or Pass/No Pass option)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CIS-81', 'Introduction to Desktop Publishing using Adobe InDesign', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Introduction to Adobe InDesign, the industrystandard publishing app. Design and publish high-quality documents across a full spectrum of digital and print media.11.0601 54.00 hours lecture and 18.00 hours laboratory. (TBA Option) (Same as CAT-81) (Letter grade or', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CIS-59', 'Typography and Graphic Design', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'This course is a study of the fundamentals of typography including type anatomy, design, hierarchy, and aesthetic expression. Emphasis is placed on the process of design development from roughs to comprehensives, layout, and the use of type for effective communication. Industry standard software is used in the development of typographic and graphic design solutions appropriate for print, web and other media. 36.00 hours lecture and 72.00 hours laboratory. (Same as ADM-62) (Letter grade only)', false, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ART-22', 'Two Dimensional Design', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the fundamentals of twodimensional design. The organization of visual elements according to the principles of design. Emphasis placed on visual perception, theory, dexterity, problem solving, analysis, application, skill, and presentation. 36.00 hours lecture and 72.00 hours laboratory. (Letter grade or Pass/', false, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'ART-39', 'Design and Graphics', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Fundamental design methodology for visual communication. Exploration of design principles in advertising and layout design, type and lettering creation and techniques, corporate imagery, and portfolio preparation. Students pay for their own materials. 36.00 hours lecture and 72.00 hours laboratory. (Letter grade or', false, NULL, 8
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'CIS-44', 'Portfolio Production', 2, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Creative organization and presentation of a body of work exhibiting portfolio-quality aptitude. Covers all aspects of creation and presentation of a professional portfolio for students of multimedia majors such as 3D modeling, animation, game design, game programming, mobile applications development and graphic design. Students will edit existing work to emphasize individual strengths and areas of specialization. Compilation of a professional resume and mock interviews will be completed by each student. 18.00 hours lecture and 54.00 hours laboratory. (Letter grade only)', false, NULL, 9
    );
  END IF;

  -- ── Game Development - Game Design ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'game-development-game-design',
    'Game Development - Game Design',
    'A.S. Degree | Certificate of Achievement',
    'School of Math, Engineering, Computer Science & Game Development',
    27,
    'Students will be well versed in the process by which games and game assets are designed and created, with a special emphasis on planning, building, testing, and documenting mechanical and economical systems and elements for a range of game types and platforms.',
    '["Build, test, and document analog and digital prototypes based on theory-driven design techniques","Apply the principles of modern game development through the creation of creative assets and supporting materials","Contribute to working games and prototypes requiring team management, effective planning, and communication","Create modern portfolio demonstrating viable capability utilizing games and class projects"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-1', 'Business of Video Games', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the field of game development. Students will explore the job market, career paths and business aspects of game development professionals. 54.00 hours lecture. (Letter grade only)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-2', 'History of Video Games', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'A comprehensive study of the evolution of video games, including their technological and artistic antecedents, with analysis of how video games reflect the beliefs, aspirations and values of the cultures where they flourish. Study includes gameplay experience and analysis of notable game genres, identifying significant artistic and technological innovations. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-3A', 'Game Design', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the fundamental techniques, concepts, vocabulary, and practical application of these skills towards the discipline of game design. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-3B', 'Advanced Game Design', 3, 1, 'Spring',
      'core', 'GAM 3A', '[]'::jsonb,
      'An advanced exploration of game design emphasizing gameplay tuning, focus group testing, analytics, and user experience. 54.00 hours lecture. (Letter grade only)', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-4A', 'Game Scripting', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'A first course in programming for games stressing fundamental programming principles. Covers the logic structures and design paradigms that allow for fundamental interactions in digital games. 54.00 hours lecture. (Letter grade only)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-5A', 'Concept Art', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Introduction to digital drawing techniques using industry standard software. Covers the usage of digital drawing hardware and drawing skills with an emphasis on creative and conceptual expression. A course in sketching, digital drawing, matte painting, and visual ideation targeted towards the video games industry. Emphasizes topics in anatomy, perspective, color, mood, shape, and context. 54.00 hours lecture. (Letter grade', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-6A', '3D Digital Modeling', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Introduces concepts of 3D Modeling in a virtual environment. Emphasis is on the introduction of three-dimensional concepts, the use of modeling tools, and menu structures within applications of 3D design systems. 54.00 hours lecture. (Letter grade only)', false, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-7', 'Game Studio', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Introduction to practical game development techniques emphasizing team skills, project management, scope discipline, and task completion. Focuses on delivering finished projects for the purpose of portfolio or further development. 54.00 hours lecture. (TBA Option) (Letter grade only)', false, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-8', 'Current Topics in Game Development', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'A workshop class focusing on a single aspect or discipline of games development that is contemporary, modern, or of particular need in the games industry. 54.00 hours lecture. (Letter grade only)', false, NULL, 8
    );
  END IF;

  -- ── Game Development - Game Programming ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'game-development-game-programming',
    'Game Development - Game Programming',
    'A.S. Degree | Certificate of Achievement',
    'School of Math, Engineering, Computer Science & Game Development',
    27,
    'Students will be well versed in the process by which games and game assets are designed and created, with a special emphasis on how they are programmatically constructed. Students will be capable of building complete simple games and intermediate game systems that integrate with large programs.',
    '["Build simple to intermediate game systems using logic and programming using modern game development software","Apply the principles of modern game development through the creation of creative assets and supporting materials","Contribute to working games and prototypes requiring team management, effective planning, and communication","Create modern portfolio demonstrating viable capability utilizing games and class projects"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-1', 'Business of Video Games', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the field of game development. Students will explore the job market, career paths and business aspects of game development professionals. 54.00 hours lecture. (Letter grade only)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-2', 'History of Video Games', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'A comprehensive study of the evolution of video games, including their technological and artistic antecedents, with analysis of how video games reflect the beliefs, aspirations and values of the cultures where they flourish. Study includes gameplay experience and analysis of notable game genres, identifying significant artistic and technological innovations. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-3A', 'Game Design', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the fundamental techniques, concepts, vocabulary, and practical application of these skills towards the discipline of game design. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-4A', 'Game Scripting', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'A first course in programming for games stressing fundamental programming principles. Covers the logic structures and design paradigms that allow for fundamental interactions in digital games. 54.00 hours lecture. (Letter grade only)', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-4B', 'Advanced Game Scripting', 3, 1, 'Spring',
      'core', 'CIS 17B or CSC 17B or CSC 18B or CIS 18B or GAM 4A', '[]'::jsonb,
      'An advanced exploration of Game Scripting concepts. Emphasizes the use of design patterns, optimization, process, and efficiency in the activity of games programming. 54.00 hours lecture. (Letter grade', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-5A', 'Concept Art', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Introduction to digital drawing techniques using industry standard software. Covers the usage of digital drawing hardware and drawing skills with an emphasis on creative and conceptual expression. A course in sketching, digital drawing, matte painting, and visual ideation targeted towards the video games industry. Emphasizes topics in anatomy, perspective, color, mood, shape, and context. 54.00 hours lecture. (Letter grade', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-6A', '3D Digital Modeling', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Introduces concepts of 3D Modeling in a virtual environment. Emphasis is on the introduction of three-dimensional concepts, the use of modeling tools, and menu structures within applications of 3D design systems. 54.00 hours lecture. (Letter grade only)', false, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-7', 'Game Studio', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Introduction to practical game development techniques emphasizing team skills, project management, scope discipline, and task completion. Focuses on delivering finished projects for the purpose of portfolio or further development. 54.00 hours lecture. (TBA Option) (Letter grade only)', false, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-8', 'Current Topics in Game Development', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'A workshop class focusing on a single aspect or discipline of games development that is contemporary, modern, or of particular need in the games industry. 54.00 hours lecture. (Letter grade only)', false, NULL, 8
    );
  END IF;

  -- ── Game Development - Game Development Core ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'game-development-game-development-core',
    'Game Development - Game Development Core',
    'A.S. Degree | Certificate of Achievement',
    'School of Math, Engineering, Computer Science & Game Development',
    21,
    'Students will be well versed in the process by which games and game assets are designed and created, exploring a breadth of topics spanning the core disciplines of games creation. Students will be prepared to enter the field as junior designers, programmers, artists, and producers.',
    '["Apply the principles of modern game development through the creation of creative assets and supporting materials","Contribute to working games and prototypes requiring team management, effective planning, and communication","Develop content that contributes and adds value to games projects or portfolio","Create modern portfolio demonstrating viable capability utilizing games and class projects"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-1', 'Business of Video Games', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the field of game development. Students will explore the job market, career paths and business aspects of game development professionals. 54.00 hours lecture. (Letter grade only)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-2', 'History of Video Games', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'A comprehensive study of the evolution of video games, including their technological and artistic antecedents, with analysis of how video games reflect the beliefs, aspirations and values of the cultures where they flourish. Study includes gameplay experience and analysis of notable game genres, identifying significant artistic and technological innovations. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-3A', 'Game Design', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the fundamental techniques, concepts, vocabulary, and practical application of these skills towards the discipline of game design. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-4A', 'Game Scripting', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'A first course in programming for games stressing fundamental programming principles. Covers the logic structures and design paradigms that allow for fundamental interactions in digital games. 54.00 hours lecture. (Letter grade only)', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-5A', 'Concept Art', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Introduction to digital drawing techniques using industry standard software. Covers the usage of digital drawing hardware and drawing skills with an emphasis on creative and conceptual expression. A course in sketching, digital drawing, matte painting, and visual ideation targeted towards the video games industry. Emphasizes topics in anatomy, perspective, color, mood, shape, and context. 54.00 hours lecture. (Letter grade', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-6A', '3D Digital Modeling', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Introduces concepts of 3D Modeling in a virtual environment. Emphasis is on the introduction of three-dimensional concepts, the use of modeling tools, and menu structures within applications of 3D design systems. 54.00 hours lecture. (Letter grade only)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-7', 'Game Studio', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Introduction to practical game development techniques emphasizing team skills, project management, scope discipline, and task completion. Focuses on delivering finished projects for the purpose of portfolio or further development. 54.00 hours lecture. (TBA Option) (Letter grade only)', false, NULL, 6
    );
  END IF;

  -- ── Game Development - Game Concept Art ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'game-development-game-concept-art',
    'Game Development - Game Concept Art',
    'A.S. Degree | Certificate of Achievement',
    'School of Math, Engineering, Computer Science & Game Development',
    27,
    'Students will be well versed in the process by which games and game assets are designed and created, with a special emphasis on how visual development influences game design and aesthetic. Students will be capable of designing and visually articulating a range of asset types spanning props, environments, characters and more.',
    '["Articulate visual direction of various game-targeted assets through concept ideation and rendering","Apply the principles of modern game development through the creation of creative assets","Contribute to working games and prototypes requiring team management, effective planning, and communication","Create modern portfolio demonstrating viable capability utilizing games and class projects"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-1', 'Business of Video Games', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the field of game development. Students will explore the job market, career paths and business aspects of game development professionals. 54.00 hours lecture. (Letter grade only)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-2', 'History of Video Games', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'A comprehensive study of the evolution of video games, including their technological and artistic antecedents, with analysis of how video games reflect the beliefs, aspirations and values of the cultures where they flourish. Study includes gameplay experience and analysis of notable game genres, identifying significant artistic and technological innovations. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-3A', 'Game Design', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the fundamental techniques, concepts, vocabulary, and practical application of these skills towards the discipline of game design. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-4A', 'Game Scripting', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'A first course in programming for games stressing fundamental programming principles. Covers the logic structures and design paradigms that allow for fundamental interactions in digital games. 54.00 hours lecture. (Letter grade only)', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-5A', 'Concept Art', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Introduction to digital drawing techniques using industry standard software. Covers the usage of digital drawing hardware and drawing skills with an emphasis on creative and conceptual expression. A course in sketching, digital drawing, matte painting, and visual ideation targeted towards the video games industry. Emphasizes topics in anatomy, perspective, color, mood, shape, and context. 54.00 hours lecture. (Letter grade', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-5B', 'Advanced Concept Art', 3, 1, 'Spring',
      'core', 'GAM 5A', '[]'::jsonb,
      'An advanced course in concept art, focusing on iteration, speed, efficiency, precision, and working within constraints. Emphasizes form, function, narrative, context, and thorough exploration of ideas in a rapid and visual manner. 54.00 hours lecture. (Letter grade only)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-6A', '3D Digital Modeling', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Introduces concepts of 3D Modeling in a virtual environment. Emphasis is on the introduction of three-dimensional concepts, the use of modeling tools, and menu structures within applications of 3D design systems. 54.00 hours lecture. (Letter grade only)', false, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-7', 'Game Studio', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Introduction to practical game development techniques emphasizing team skills, project management, scope discipline, and task completion. Focuses on delivering finished projects for the purpose of portfolio or further development. 54.00 hours lecture. (TBA Option) (Letter grade only)', false, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-8', 'Current Topics in Game Development', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'A workshop class focusing on a single aspect or discipline of games development that is contemporary, modern, or of particular need in the games industry. 54.00 hours lecture. (Letter grade only)', false, NULL, 8
    );
  END IF;

  -- ── Game Development - 3D Game Modeling and Animation ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'game-development-3d-game-modeling-and-animation',
    'Game Development - 3D Game Modeling and Animation',
    'A.S. Degree | Certificate of Achievement',
    'School of Math, Engineering, Computer Science & Game Development',
    27,
    'Students will be well versed in the process by which games and game assets are designed and created, with a special emphasis on how 3D game assets are constructed and integrated. Students will be capable of building a variety of 3D asset types ranging from simple static props to intermediate animated objects.',
    '["Build modeled, textured, rigged, and animated 3D game assets using modern software and techniques","Apply the principles of modern game development through the creation of creative assets and supporting materials","Contribute to working games and prototypes requiring team management, effective planning, and communication","Create modern portfolio demonstrating viable capability utilizing games and class projects"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-1', 'Business of Video Games', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the field of game development. Students will explore the job market, career paths and business aspects of game development professionals. 54.00 hours lecture. (Letter grade only)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-2', 'History of Video Games', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'A comprehensive study of the evolution of video games, including their technological and artistic antecedents, with analysis of how video games reflect the beliefs, aspirations and values of the cultures where they flourish. Study includes gameplay experience and analysis of notable game genres, identifying significant artistic and technological innovations. 54.00 hours lecture. (Letter grade only)', false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-3A', 'Game Design', 3, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'An introduction to the fundamental techniques, concepts, vocabulary, and practical application of these skills towards the discipline of game design. 54.00 hours lecture. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-4A', 'Game Scripting', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'A first course in programming for games stressing fundamental programming principles. Covers the logic structures and design paradigms that allow for fundamental interactions in digital games. 54.00 hours lecture. (Letter grade only)', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-5A', 'Concept Art', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Introduction to digital drawing techniques using industry standard software. Covers the usage of digital drawing hardware and drawing skills with an emphasis on creative and conceptual expression. A course in sketching, digital drawing, matte painting, and visual ideation targeted towards the video games industry. Emphasizes topics in anatomy, perspective, color, mood, shape, and context. 54.00 hours lecture. (Letter grade', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-6A', '3D Digital Modeling', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Introduces concepts of 3D Modeling in a virtual environment. Emphasis is on the introduction of three-dimensional concepts, the use of modeling tools, and menu structures within applications of 3D design systems. 54.00 hours lecture. (Letter grade only)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-6B', '3D Animation', 3, 2, 'Fall',
      'core', 'GAM 6A', '[]'::jsonb,
      'How to prepare an animation rig accurately and anatomically in a 3D simulation environment. Prepare previously created humanoid and creature 3D models and animate them using professional production techniques. 54.00 hours lecture. (Letter grade only)', false, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-7', 'Game Studio', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Introduction to practical game development techniques emphasizing team skills, project management, scope discipline, and task completion. Focuses on delivering finished projects for the purpose of portfolio or further development. 54.00 hours lecture. (TBA Option) (Letter grade only)', false, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'GAM-8', 'Current Topics in Game Development', 3, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'A workshop class focusing on a single aspect or discipline of games development that is contemporary, modern, or of particular need in the games industry. 54.00 hours lecture. (Letter grade only)', false, NULL, 8
    );
  END IF;

  -- ── Music Industry Studies - Audio Production ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'music-industry-studies-audio-production',
    'Music Industry Studies - Audio Production',
    'A.S. Degree | Certificate of Achievement',
    'School of Visual & Performing Arts',
    37,
    'Designed to provide students with the knowledge and skills necessary for producing popular music and engineering in the recording studio as well as for live sound. Students become proficient on a DAW, gain experience recording and producing music on digital and analog devices, and record and mix in a state-of-the-art multi-track digital recording studio.',
    '["Demonstrate an understanding of musicianship and music theory","Employ music technology to create and refine musical product","Sensitively enhance multitrack recordings and live performances as a mixing engineer","Collaborate effectively with peers to create new musical works that exhibit quality and craftsmanship"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MIS-1A', 'Beginning Performance Techniques For Studio Recording', 2, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Introduction to practical performance techniques for the recording studio. Students will have the opportunity to participate in the planning process of a recording session utilizing techniques such as song formation, microphone technique, mixing and production. The class will culminate in a CD recording. This class is appropriate for vocalists and instrumentalists. 108.00 hours laboratory. (Letter grade only)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MIS-1B', 'MIS-1B', 3, 1, 'Fall',
      'core', NULL, '[]'::jsonb,
      NULL, false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MIS-1C', 'Advanced Performance Techniques For Studio Recording', 2, 1, 'Fall',
      'core', 'MIS 1B', '[]'::jsonb,
      'Advanced performance techniques for the recording studio. A continuation of the skills studied in MIS-1B the focus of this course is communication, song collaboration, studio session mapping. Students will have the opportunity to lead a collaborative group, duet or solo project toward successful completion/recording utilizing techniques such as song formation, microphone technique, mixing and production. The class will culminate in a CD recording. This class is appropriate for advanced vocalists and instrumentalists. 108.00 hours laboratory. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MUS-3', 'Fundamentals of Music', 4, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Through guided music notation and analysis, Fundamentals of Music incorporates the following concepts: Rhythm and meter; basic properties of sound; intervals; diatonic scales and triads; diatonic chords; basic cadential formulas and phrase structure; dominant seventh; figured bass symbols; and non-harmonic tones. Development of skills in handwritten notation is expected. Laboratory includes sight singing and ear training activities that incorporate melodic, harmonic, and rhythmic dictation. Keyboard activities require the playing of major and minor scales, modes, triads, and seventh chords. 54.00 hours lecture and 54.00 hours laboratory. (TBA Option) (Letter grade only)', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MUS-93', 'The Business of Music', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'An overview of the business side of performing, recording, and publishing music. Study of contracts, trademarks, copyrights, and marketing including the roles of personal managers, business managers, attorneys, and agents. Overview of songwriting, publishing, recordings, and royalties. Basics of touring, merchandising, and local arrangements. 54.00 hours lecture. (Letter grade only)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MIS-3', 'Digital Audio Production 1', 4, 1, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'This course introduces the techniques and elements of electronic music production. Topics include synthesis, sampling, MIDI sequencing and audio production. Students will create original compositions using electronic music techniques. Students taking this course will complete the official AVID coursework for Pro Tools 101 and 110 and will have the opportunity to obtain AVID Pro Tools User Certification. 54.00 hours lecture and 54.00 hours laboratory. (Letter grade only)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MIS-2', 'Songwriting', 2, 2, 'Fall',
      'elective', 'MUS 3', '[]'::jsonb,
      'Introduction to popular songwriting techniques. Topics covered include chord structure, form, rhythm, melody, harmony, lyrics, chord progressions, preparing lead sheets and arranging. This course is ideal for vocalists and instrumentalists. 18.00 hours lecture and 54.00 hours laboratory. (Letter grade only)', true, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MIS-4', 'Digital Audio Production 2', 4, 2, 'Fall',
      'elective', 'MIS 3', '[]'::jsonb,
      'This intermediate course continues exploration and application of the elements and techniques of electronic music production. Topics include synthesis, sampling, MIDI sequencing and advanced audio production. Students will create original compositions using electronic music techniques. Students taking this course will complete the official AVID coursework for Pro Tools 201 and 210 and will have the opportunity to obtain AVID Pro Tools Operator Certification. 54.00 hours lecture and 54.00 hours laboratory. (Letter grade only)', true, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MIS-7', 'Introduction To Music Technology', 3, 2, 'Fall',
      'elective', 'None.', '[]'::jsonb,
      'This introductory course examines the terminology, equipment, techniques, and concepts related to music technology. The course will survey the principles and practices of audio, MIDI synthesis, notation, and audio recording utilizing hardware and software platforms. 36.00 hours lecture and 54.00 hours laboratory. (Letter grade', true, NULL, 8
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MIS-12', 'Live Sound Reinforcement', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'This course is an overview of live concert sound reinforcement. This course focuses on the fundamentals of equipment set up and configuration, mixing surfaces, amplifiers, speakers, signal path, signal processing, microphones, monitoring and mixing techniques and acoustics. This course offers opportunities for hands-on experience in troubleshooting, sound checking and mixing live sound. 36.00 hours lecture and 54.00 hours laboratory. (Letter grade only)', true, NULL, 9
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MIS-13', 'Recording Studio Workshop I', 3, 2, 'Spring',
      'elective', 'MIS 3 and MIS 12', '[]'::jsonb,
      'This applied workshop course is a survey of the fundamental principles and practices of audio recording. Topics include sound and hearing, acoustics, the components of various recording systems and signal flow. It provides practical experience with audio hardware, software and recording techniques. Students will engage in digital audio workstation set up (DAWs) and operation, and will run studio and live sessions from set up to tear down. 36.00 hours lecture and 54.00 hours laboratory. (Letter grade only)', true, NULL, 10
    );
  END IF;

  -- ── Music Industry Studies - Performance ──────────────
  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)
  VALUES (
    'music-industry-studies-performance',
    'Music Industry Studies - Performance',
    'A.A. Degree | Certificate of Achievement',
    'School of Visual & Performing Arts',
    36,
    'Designed to provide students with the knowledge and skills necessary for studio recording and live performance in the commercial music industry. Students become proficient on an instrument or voice, gain experience as an ensemble member, and study the fundamentals of music including sight-reading, piano skills, and digital/analog music technology.',
    '["Demonstrate an understanding of musicianship and music theory","Employ music technology to create and refine musical product","Sensitively interpret and communicate musical literature as a performer or studio musician","Collaborate effectively with peers to create new musical works exhibiting quality and craftsmanship"]'::jsonb
  ) ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prog_id;

  IF prog_id IS NOT NULL THEN
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MIS-1A', 'Beginning Performance Techniques For Studio Recording', 2, 1, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Introduction to practical performance techniques for the recording studio. Students will have the opportunity to participate in the planning process of a recording session utilizing techniques such as song formation, microphone technique, mixing and production. The class will culminate in a CD recording. This class is appropriate for vocalists and instrumentalists. 108.00 hours laboratory. (Letter grade only)', false, NULL, 0
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MIS-1B', 'MIS-1B', 3, 1, 'Fall',
      'core', NULL, '[]'::jsonb,
      NULL, false, NULL, 1
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MIS-1C', 'Advanced Performance Techniques For Studio Recording', 2, 1, 'Fall',
      'core', 'MIS 1B', '[]'::jsonb,
      'Advanced performance techniques for the recording studio. A continuation of the skills studied in MIS-1B the focus of this course is communication, song collaboration, studio session mapping. Students will have the opportunity to lead a collaborative group, duet or solo project toward successful completion/recording utilizing techniques such as song formation, microphone technique, mixing and production. The class will culminate in a CD recording. This class is appropriate for advanced vocalists and instrumentalists. 108.00 hours laboratory. (Letter grade only)', false, NULL, 2
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MUS-3', 'Fundamentals of Music', 4, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'Through guided music notation and analysis, Fundamentals of Music incorporates the following concepts: Rhythm and meter; basic properties of sound; intervals; diatonic scales and triads; diatonic chords; basic cadential formulas and phrase structure; dominant seventh; figured bass symbols; and non-harmonic tones. Development of skills in handwritten notation is expected. Laboratory includes sight singing and ear training activities that incorporate melodic, harmonic, and rhythmic dictation. Keyboard activities require the playing of major and minor scales, modes, triads, and seventh chords. 54.00 hours lecture and 54.00 hours laboratory. (TBA Option) (Letter grade only)', false, NULL, 3
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MUS-93', 'The Business of Music', 3, 1, 'Spring',
      'core', 'None.', '[]'::jsonb,
      'An overview of the business side of performing, recording, and publishing music. Study of contracts, trademarks, copyrights, and marketing including the roles of personal managers, business managers, attorneys, and agents. Overview of songwriting, publishing, recordings, and royalties. Basics of touring, merchandising, and local arrangements. 54.00 hours lecture. (Letter grade only)', false, NULL, 4
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MUS-39', 'Applied Music I', 3, 1, 'Spring',
      'core', 'None. Corequisite: MUS 42 or enrollment in another one or two unit large ensemble course.', '[]'::jsonb,
      'Vocal or instrumental instruction for students who are proficient performers and could benefit from individualized instruction as determined by audition. Each student must complete 10.125 hours per week in a combination of individualized practice, lessons, concert attendance and individual performance. Not designed for beginning students. May be taken a total of four times. 162.00 hours laboratory. (TBA Option) (Letter grade only)', false, NULL, 5
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MUS-79', 'Applied Music II', 3, 2, 'Fall',
      'core', 'None. Corequisite: MUS 42 or enrollment in another one or two unit large ensemble course.', '[]'::jsonb,
      'Advanced vocal or instrumental instruction for students who are proficient performers and could benefit from individualized instruction as determined by audition. Each student must complete a minimum of 10.125 hours per week in a combination of individualized practice, lessons, concert attendance and individual performance. Not designed for beginning students. May be taken a total of four times. 162.00 hours laboratory. (TBA Option) (Letter grade only)', false, NULL, 6
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MUS-41', 'Chamber Singers', 2, 2, 'Fall',
      'core', 'None.', '[]'::jsonb,
      'Study, rehearsal, and public performance of literature for vocal chamber ensemble, with an emphasis on the development of skills needed to perform within an ensemble. Different literature will be studied each semester. Participation in public performances is required. May be taken a total of four times. 108.00 hours laboratory. (TBA Option) (Letter grade only)', false, NULL, 7
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MIS-3', 'Digital Audio Production 1', 4, 2, 'Fall',
      'elective', 'None.', '[]'::jsonb,
      'This course introduces the techniques and elements of electronic music production. Topics include synthesis, sampling, MIDI sequencing and audio production. Students will create original compositions using electronic music techniques. Students taking this course will complete the official AVID coursework for Pro Tools 101 and 110 and will have the opportunity to obtain AVID Pro Tools User Certification. 54.00 hours lecture and 54.00 hours laboratory. (Letter grade only)', true, NULL, 8
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MIS-7', 'Introduction To Music Technology', 3, 2, 'Spring',
      'elective', 'None.', '[]'::jsonb,
      'This introductory course examines the terminology, equipment, techniques, and concepts related to music technology. The course will survey the principles and practices of audio, MIDI synthesis, notation, and audio recording utilizing hardware and software platforms. 36.00 hours lecture and 54.00 hours laboratory. (Letter grade', true, NULL, 9
    );
    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)
    VALUES (
      prog_id, 'MUS-4', 'Music Theory I', 4, 2, 'Spring',
      'elective', 'MUS 3 or the equivalent.', '[]'::jsonb,
      'Through guided composition and analysis, Music Theory I incorporates the following concepts: Rhythm and meter; basic properties of sound; intervals; diatonic scales, triads, and seventh chords; basic cadential formulas and phrase structures; figured bass; nonharmonic tones; first-species counterpoint; and voice leading involving 4-part chorale writing. Development of skills in handwritten music notation is expected. Laboratory includes sight singing and ear training activities that incorporate melodic, harmonic, and rhythmic dictation. Keyboard activities require the playing of chord progressions, modes, and scales in all major and minor keys. 54.00 hours lecture and 54.00 hours laboratory. (TBA Option) (Letter grade only)', true, NULL, 10
    );
  END IF;

END $$;

-- Verify
SELECT name, cluster, total_units FROM programs ORDER BY cluster, name;