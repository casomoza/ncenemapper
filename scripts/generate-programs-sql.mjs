/**
 * Generates a SQL file with INSERT statements for all 30 new programs.
 * Run: node scripts/generate-programs-sql.mjs > supabase/migrations/bulk_programs.sql
 */
import fs from "fs";

const catalogRaw = fs.readFileSync("./src/lib/catalog-courses.json", "utf8");
const catalogCourses = JSON.parse(catalogRaw);
const byCode = {};
for (const c of catalogCourses) {
  byCode[c.code] = c;
}
function info(code) {
  const c = byCode[code];
  return c
    ? { title: c.title, units: c.units, description: c.description || null, prerequisite: c.prerequisite || null }
    : { title: code, units: 3, description: null, prerequisite: null };
}

function makeSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 60);
}

function sq(s) {
  if (s === null || s === undefined) return "NULL";
  return `'${String(s).replace(/'/g, "''")}'`;
}

function assignSemesters(courses) {
  const n = courses.length;
  const sems = [];
  if (n <= 3) {
    sems.push(...Array(n).fill({ year: 1, semester: "Fall" }));
  } else if (n <= 6) {
    const half = Math.ceil(n / 2);
    sems.push(...Array(half).fill({ year: 1, semester: "Fall" }));
    sems.push(...Array(n - half).fill({ year: 1, semester: "Spring" }));
  } else if (n <= 10) {
    const s1 = Math.ceil(n / 3);
    const s2 = Math.ceil((n - s1) / 2);
    const s3 = n - s1 - s2;
    sems.push(...Array(s1).fill({ year: 1, semester: "Fall" }));
    sems.push(...Array(s2).fill({ year: 1, semester: "Spring" }));
    sems.push(...Array(s3).fill({ year: 2, semester: "Fall" }));
  } else {
    const q = Math.ceil(n / 4);
    const map = [
      { year: 1, semester: "Fall" },
      { year: 1, semester: "Spring" },
      { year: 2, semester: "Fall" },
      { year: 2, semester: "Spring" },
    ];
    for (let i = 0; i < n; i++) sems.push(map[Math.min(Math.floor(i / q), 3)]);
  }
  return courses.map((c, i) => ({ ...c, ...sems[i] }));
}

const BA_CORE = [
  { code: "ACC-1A", category: "core" },
  { code: "BUS-10", category: "core" },
  { code: "BUS-18A", category: "core" },
  { code: "BUS-20", category: "core" },
  { code: "BUS-22", category: "core" },
  { code: "CIS-1A", category: "core" },
];

const PROGRAMS = [
  {
    name: "Business Administration - Concentration in Accounting",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Business & Management",
    total_units: 30,
    description: "Prepares individuals to practice the profession of accounting and to perform related business functions, including financial accounting, managerial accounting, cost accounting, budget control, tax accounting, legal aspects of accounting, and accounting research methods.",
    outcomes: ["Apply basic business and accounting calculations and analyses", "Apply accounting principles related to payroll, cost, income tax, and computerized accounting", "Analyze and interpret data and reports for a variety of business entities", "Develop and apply principles of moral judgment and ethical behavior to business situations"],
    courses: [...BA_CORE, { code: "ACC-1B", category: "core" }, { code: "ACC-40", category: "elective", optional: true }, { code: "ACC-55", category: "elective", optional: true }, { code: "ACC-62", category: "elective", optional: true }, { code: "ACC-63", category: "elective", optional: true }, { code: "ACC-65", category: "elective", optional: true }, { code: "ACC-67", category: "elective", optional: true }],
  },
  {
    name: "Business Administration - Concentration in General Business",
    degree_type: "Certificate of Achievement",
    cluster: "School of Business & Management",
    total_units: 30,
    description: "Focuses on the general study of business, including domestic, international, and electronic commerce, and the important ways in which business impacts daily life. Prepares individuals to apply business principles and techniques in various career settings.",
    outcomes: ["Use technology to analyze business decisions and enhance business communications", "Apply basic business and accounting calculations and analyses", "Analyze the law as it pertains to business organizations", "Explain and develop the marketing mix and analyze marketing mix variables"],
    courses: [...BA_CORE, { code: "ACC-1B", category: "elective", optional: true }, { code: "BUS-40", category: "elective", optional: true }, { code: "BUS-80", category: "elective", optional: true }, { code: "MAG-51", category: "elective", optional: true }, { code: "MAG-53", category: "elective", optional: true }, { code: "MKT-20", category: "elective", optional: true }],
  },
  {
    name: "Business Administration - Concentration in Logistics Management",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Business & Management",
    total_units: 30,
    description: "Prepares students for entry into or career growth within the logistics industry. Focuses on integrated logistics, a necessity for management of effective and efficient supply chains, covering warehousing, transportation, service contracting, purchasing, and global logistics.",
    outcomes: ["Compare roles and objectives of the logistics disciplines", "Contribute knowledge needed by multidisciplinary teams to integrate and exceed end user expectations", "Analyze, prepare, file and process claims when freight disputes arise", "Identify 3rd party logistics provider and client needs in negotiations, bidding, and contracts"],
    courses: [...BA_CORE, { code: "BUS-80", category: "core" }, { code: "BUS-85", category: "elective", optional: true }, { code: "BUS-86", category: "elective", optional: true }, { code: "BUS-87", category: "elective", optional: true }, { code: "BUS-90", category: "elective", optional: true }],
  },
  {
    name: "Business Administration - Concentration in Management",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Business & Management",
    total_units: 30,
    description: "Prepares individuals to plan, organize, direct, and control the functions and processes of a firm or organization with an emphasis on people as the most important asset. Prepares students seeking management positions to be better candidates for promotion.",
    outcomes: ["Use technology to analyze business decisions and enhance business communications", "Apply sound management practices", "Analyze and apply appropriate managerial practices in ethics, human resources, and quality management", "Apply basic business and accounting calculations and analyses"],
    courses: [...BA_CORE, { code: "MAG-44", category: "core" }, { code: "MAG-53", category: "elective", optional: true }, { code: "MAG-56", category: "elective", optional: true }, { code: "MAG-60", category: "elective", optional: true }, { code: "BUS-48", category: "elective", optional: true }],
  },
  {
    name: "Business Administration - Concentration in Real Estate",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Business & Management",
    total_units: 30,
    description: "Prepares individuals to develop, buy, sell, appraise, and manage real property. Includes instruction in land use development policy, real estate law, real estate marketing procedures, agency management, brokerage, property inspection and appraisal, and property management.",
    outcomes: ["Analyze ethical and procedural problems in residential real estate sales transactions", "Discuss and evaluate real estate marketing and sales techniques", "Calculate real estate taxes and solve basic real estate mathematics problems", "Explain and evaluate methods of financing real estate purchases and securing loans"],
    courses: [...BA_CORE, { code: "RLE-80", category: "elective", optional: true }, { code: "RLE-81", category: "elective", optional: true }, { code: "RLE-82", category: "elective", optional: true }, { code: "RLE-83", category: "elective", optional: true }, { code: "RLE-84", category: "elective", optional: true }, { code: "RLE-85", category: "elective", optional: true }],
  },
  {
    name: "Business Information Worker",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Business & Management",
    total_units: 19,
    description: "Designed to prepare students for entry-level and administrative support in a variety of fields and businesses. Students develop computer literacy, keyboarding skills, and proficiency in word processing, spreadsheet, presentation graphics, and scheduling software.",
    outcomes: ["Demonstrate computer literacy with respect to computer hardware and software applications", "Apply standard rules of business conduct and customer service", "Develop specialized keyboarding skills at an employable level of accuracy and speed", "Use word processing, spreadsheet, presentation graphics, and scheduling software to perform business and office tasks"],
    courses: [{ code: "CAT-1A", category: "core" }, { code: "CAT-3", category: "core" }, { code: "CAT-31", category: "core" }, { code: "CAT-51", category: "core" }, { code: "CAT-90", category: "core" }, { code: "CAT-93", category: "core" }, { code: "CAT-98A", category: "core" }, { code: "CAT-98B", category: "core" }],
  },
  {
    name: "Entrepreneurial Essentials",
    degree_type: "Certificate of Achievement",
    cluster: "School of Business & Management",
    total_units: 12,
    description: "Designed for those interested in starting their own business, exposing students to the basics of entrepreneurship, including design thinking, customer assessment, problem solving, financing, and leveraging resources.",
    outcomes: ["Develop a business plan outlining the viability and sustainability of an idea", "Create a value proposition and test market assumptions for a business idea", "Apply standard accounting practices and evaluate finance opportunities"],
    courses: [{ code: "ENP-50", category: "core" }, { code: "ENP-51", category: "core" }, { code: "ENP-52", category: "core" }, { code: "ENP-53", category: "core" }],
  },
  {
    name: "Entrepreneurial Foundations",
    degree_type: "Certificate of Achievement",
    cluster: "School of Business & Management",
    total_units: 15,
    description: "Designed for those interested in starting their own business, exposing students to the basics of entrepreneurship including design thinking, customer assessment, problem solving, financing, and leveraging resources. Utilizes the Business Model Canvas technique.",
    outcomes: ["Develop a comprehensive business plan outlining the viability and sustainability of an idea", "Apply standard accounting practices and evaluate finance opportunities", "Create a Business Model Canvas showcasing main components and deliver a compelling presentation"],
    courses: [{ code: "ENP-50", category: "core" }, { code: "ENP-51", category: "core" }, { code: "ENP-53", category: "core" }, { code: "ENP-54", category: "core" }, { code: "ENP-55", category: "core" }],
  },
  {
    name: "Entrepreneurship: Getting Started",
    degree_type: "Certificate of Achievement",
    cluster: "School of Business & Management",
    total_units: 10,
    description: "Includes courses intended to help students interested in pursuing entrepreneurship develop new ideas, recognize and take advantage of opportunities, as a foundation for creating a new business.",
    outcomes: ["Demonstrate an understanding of the entrepreneurial process from idea generation to commercialization", "Analyze and evaluate potential business ideas for marketability and success", "Create and evaluate a comprehensive business plan", "Outline and construct steps needed to create an effective social marketing campaign for a small business"],
    courses: [{ code: "BUS-30", category: "core" }, { code: "BUS-14", category: "core" }, { code: "BUS-12", category: "core" }, { code: "BUS-13", category: "core" }],
  },
  {
    name: "Entrepreneurship and the Team",
    degree_type: "Certificate of Achievement",
    cluster: "School of Business & Management",
    total_units: 18,
    description: "Designed for those interested in starting their own business, exposing students to the basics of entrepreneurship. Utilizes the Business Model Canvas technique and provides critical insights into founding-team formation, the Gig economy, legal business structures, e-commerce, and networks.",
    outcomes: ["Develop a business plan outlining the viability and key elements in establishing business partnerships", "Apply standard accounting practices and evaluate finance opportunities", "Create a Business Model Canvas and deliver a compelling presentation", "Demonstrate the principles of the Gig Economy and recognize different types of entrepreneurial categories"],
    courses: [{ code: "ENP-50", category: "core" }, { code: "ENP-51", category: "core" }, { code: "ENP-53", category: "core" }, { code: "ENP-54", category: "core" }, { code: "ENP-70", category: "core" }, { code: "ENP-71", category: "core" }],
  },
  {
    name: "Entrepreneurship: Legal & Finance",
    degree_type: "Certificate of Achievement",
    cluster: "School of Business & Management",
    total_units: 10,
    description: "Includes courses intended to help students interested in pursuing entrepreneurship develop skills in financing, legal issues, and applied accounting and bookkeeping for the small business.",
    outcomes: ["Demonstrate an understanding of the entrepreneurial process from idea generation to commercialization", "Apply accounting and bookkeeping for small business principles", "Analyze and evaluate various funding sources for small businesses", "Outline and evaluate the legal steps and issues necessary for opening a small business"],
    courses: [{ code: "BUS-30", category: "core" }, { code: "ACC-55", category: "core" }, { code: "BUS-31", category: "core" }, { code: "BUS-33", category: "core" }],
  },
  {
    name: "Logistics Management",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Business & Management",
    total_units: 18,
    description: "Prepares students for entry into or career growth within the logistics industry. Focuses on integrated logistics, a necessity for management of effective and efficient supply chains, covering warehousing, transportation, service contracting, purchasing, and global logistics.",
    outcomes: ["Compare roles and objectives of the logistics disciplines", "Understand how logistics functions interact to efficiently use total personnel, facilities, and equipment", "Explain how the overall flow of goods, services, and information can be optimized to satisfy customer and business goals", "Describe roles and value added by global logistics intermediaries"],
    courses: [{ code: "BUS-80", category: "core" }, { code: "BUS-82", category: "core" }, { code: "BUS-83", category: "core" }, { code: "BUS-85", category: "core" }, { code: "BUS-86", category: "core" }, { code: "BUS-87", category: "core" }, { code: "BUS-90", category: "core" }],
  },
  {
    name: "Real Estate: Salesperson & Transactions",
    degree_type: "Locally Approved Certificate",
    cluster: "School of Business & Management",
    total_units: 9,
    description: "Prepares students to buy, sell, and lease residential and commercial real estate property. Prepares students to qualify for the California Real Estate Salesperson license and to successfully take the California Real Estate Salesperson exam.",
    outcomes: ["Analyze ethical and procedural problems that arise in real estate transactions", "Discuss and evaluate real estate marketing and sales techniques", "Explain and evaluate methods of financing and evaluating real estate", "Demonstrate knowledge of state and federal statutes and regulations affecting real estate sales"],
    courses: [{ code: "RLE-80", category: "core" }, { code: "RLE-81", category: "core" }, { code: "RLE-82", category: "elective", optional: true }, { code: "RLE-83", category: "elective", optional: true }, { code: "RLE-85", category: "elective", optional: true }],
  },
  {
    name: "Registered Income Tax Preparer",
    degree_type: "Locally Approved Certificate",
    cluster: "School of Business & Management",
    total_units: 4,
    description: "U.S. and California income tax principles and tax return preparation as it relates to individuals, sole proprietorships, and other business entities. This course is certified by the California Tax Education Council (CTEC) as fulfilling the 60-hour qualifying education requirement for becoming a Registered Tax Preparer.",
    outcomes: ["Prepare federal and state income tax returns for individuals, sole proprietorships, and other business entities", "Conduct tax research on client issues using manual and computerized methods", "Evaluate and propose strategies that minimize income tax obligations"],
    courses: [{ code: "ACC-67", category: "core" }],
  },
  {
    name: "Retail Management WAFC",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Business & Management",
    total_units: 30,
    description: "Prepares individuals to perform operations associated with retail sales in a variety of settings. Includes instruction in direct sales operations, basic bookkeeping principles, customer service, team/staff leadership and supervision, floor management, and applicable technical skills.",
    outcomes: ["Use GAAP guidelines to review and interpret financial documents", "Calculate pricing models for mark-ups, profit margins, discounts, and sinking funds", "Prepare and deliver effective oral and written communications through multiple modes", "Analyze the effectiveness of marketing decisions and use marketing principles to assess market potential"],
    courses: [{ code: "ACC-1A", category: "core" }, { code: "BUS-20", category: "core" }, { code: "BUS-22", category: "core" }, { code: "CIS-1A", category: "core" }, { code: "MAG-56", category: "core" }, { code: "MAG-44", category: "core" }, { code: "MAG-53", category: "core" }, { code: "MKT-20", category: "core" }, { code: "MKT-42", category: "core" }],
  },
  {
    name: "Small Business Accounting",
    degree_type: "Locally Approved Certificate",
    cluster: "School of Business & Management",
    total_units: 6,
    description: "Trains students to perform the basic duties and responsibilities required of an entry-level accounting clerk or bookkeeper utilizing accounting software.",
    outcomes: ["Perform a variety of accounting skills such as journalizing, posting, and double entry accounting", "Use accounting software to prepare financial statements and analyze problems", "Recognize the role of ethics in accounting"],
    courses: [{ code: "ACC-65", category: "core" }, { code: "ACC-1A", category: "core" }],
  },
  {
    name: "Small Business Payroll Accounting",
    degree_type: "Locally Approved Certificate",
    cluster: "School of Business & Management",
    total_units: 6,
    description: "Trains students to perform the basic duties and responsibilities required of an entry-level payroll accounting clerk.",
    outcomes: ["Analyze and evaluate payroll principles as defined by Social Security Act and laws relating to payment of wages", "Analyze and solve problems associated with calculation and reporting of payroll", "Accurately apply accounting principles to computerized and manual payroll systems"],
    courses: [{ code: "ACC-62", category: "core" }, { code: "ACC-1A", category: "core" }],
  },
  {
    name: "Crime Scene Investigation",
    degree_type: "Certificate of Achievement",
    cluster: "School of Human & Public Services",
    total_units: 21,
    description: "Provides a strong academic and skill-building pattern of coursework to prepare participants to enter the professional field with academic and technical knowledge in forensic and criminal investigative techniques used within crime scene investigations.",
    outcomes: ["Demonstrate advanced knowledge in the components of criminal law and the criminal justice system", "Analyze and demonstrate advanced knowledge in Constitutional criminal law, civil rights, and rules of evidence", "Demonstrate a proficient level of knowledge in evidence identification, collection, preservation, and chain of custody", "Understand basic and intermediate forensic science principles and techniques"],
    courses: [{ code: "ADJ-2", category: "core" }, { code: "ADJ-3", category: "core" }, { code: "ADJ-4", category: "core" }, { code: "ADJ-12", category: "core" }, { code: "ADJ-13", category: "core" }, { code: "ADJ-14", category: "core" }, { code: "ADJ-27", category: "core" }],
  },
  {
    name: "Early Childhood Education",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Human & Public Services",
    total_units: 31,
    description: "Provides an educational and practical foundation for students interested in working with children from infancy through third grade. Offers practical skills and on-site training that will prepare students for employment in the field of Early Childhood Education and fulfills required child development coursework for the state-issued Child Development Permit.",
    outcomes: ["Develop, implement, and evaluate developmentally appropriate curriculum for children who are typical and atypical", "Develop and apply appropriate practices that respect the cultural diversity of young children and their families", "Integrate an educational philosophy into classroom practices that reflects a personal belief supportive of theoretical principles", "Develop and implement a system of ongoing observational practices that adapts to the evolving needs of children"],
    courses: [{ code: "EAR-19", category: "core" }, { code: "EAR-20", category: "core" }, { code: "EAR-24", category: "core" }, { code: "EAR-25", category: "core" }, { code: "EAR-26", category: "core" }, { code: "EAR-28", category: "core" }, { code: "EAR-30", category: "core" }, { code: "EAR-42", category: "core" }, { code: "EAR-23", category: "elective", optional: true }, { code: "EAR-33", category: "elective", optional: true }, { code: "EAR-40", category: "elective", optional: true }, { code: "EAR-43", category: "elective", optional: true }],
  },
  {
    name: "Early Childhood Education Assistant",
    degree_type: "Certificate",
    cluster: "School of Human & Public Services",
    total_units: 6,
    description: "Enables the holder to care for and assist in the development and instruction of children in a child development program while under supervision. Students select two courses from EAR 20, 24, 28, and 42.",
    outcomes: ["Demonstrate an understanding of the theoretical perspectives in human development and education", "Appraise the role of the child as an active learner", "Integrate child growth and development into practical and meaningful applications"],
    courses: [{ code: "EAR-20", category: "core" }, { code: "EAR-24", category: "core", optional: true }, { code: "EAR-28", category: "core", optional: true }, { code: "EAR-42", category: "core", optional: true }],
  },
  {
    name: "Early Childhood Education: Intervention Assistant",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Human & Public Services",
    total_units: 34,
    description: "Appropriate for students interested in working as an assistant or paraprofessional in early intervention, early childhood special education, and community child development programs serving children with special needs. Provides practical skills and on-site training for employment in Early Childhood Intervention.",
    outcomes: ["Demonstrate an understanding of family function and structure along with familial need for information and support that respects diverse cultures", "Demonstrate basic knowledge of laws and regulations pertaining to and protecting children with disabilities", "Describe typical child development milestones and identify strengths and special needs of the child", "Demonstrate understanding of the purpose and intent of an inclusive environment supporting children with disabilities"],
    courses: [{ code: "EAR-19", category: "core" }, { code: "EAR-20", category: "core" }, { code: "EAR-24", category: "core" }, { code: "EAR-28", category: "core" }, { code: "EAR-40", category: "core" }, { code: "EAR-41", category: "core" }, { code: "EAR-42", category: "core" }, { code: "EAR-43", category: "core" }, { code: "EAR-46", category: "core" }, { code: "EAR-26", category: "elective", optional: true }, { code: "EAR-33", category: "elective", optional: true }, { code: "EAR-34", category: "elective", optional: true }],
  },
  {
    name: "Early Childhood Education: Twelve Core Units",
    degree_type: "Certificate of Achievement",
    cluster: "School of Human & Public Services",
    total_units: 12,
    description: "Prepares the holder to provide service in the care, development, and instruction of children in a child development program. The 12 core units form the foundation upon which further early childhood coursework is built.",
    outcomes: ["Demonstrate an understanding of the theoretical perspectives in human development and education", "Appraise the role of the child as an active learner", "Integrate child growth and development into practical and meaningful applications"],
    courses: [{ code: "EAR-20", category: "core" }, { code: "EAR-24", category: "core" }, { code: "EAR-28", category: "core" }, { code: "EAR-42", category: "core" }],
  },
  {
    name: "Computer Information Systems - Graphic Design",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Math, Engineering, Computer Science & Game Development",
    total_units: 27,
    description: "Designed for students who wish to pursue training in desktop publishing. Training focuses on using a computer to design page layouts, develop presentations, and create advertising campaigns. Students learn to design, integrate, and format all forms of digital images into printable media.",
    outcomes: ["Design and create images used for printed media in advertising web design", "Apply techniques to create and modify artwork using vector-based and bit-mapped programs", "Integrate text and graphics in a document layout program to create professional-quality full-color documents", "Demonstrate knowledge of design principles in advertising and layout design, type, and lettering applications"],
    courses: [{ code: "CIS-66", category: "core" }, { code: "CIS-72B", category: "core" }, { code: "CIS-78A", category: "core" }, { code: "CAT-78B", category: "core" }, { code: "CIS-79", category: "core" }, { code: "CIS-81", category: "core" }, { code: "CIS-59", category: "core" }, { code: "ART-22", category: "core" }, { code: "ART-39", category: "core" }, { code: "CIS-44", category: "core" }],
  },
  {
    name: "Game Development - Game Design",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Math, Engineering, Computer Science & Game Development",
    total_units: 27,
    description: "Students will be well versed in the process by which games and game assets are designed and created, with a special emphasis on planning, building, testing, and documenting mechanical and economical systems and elements for a range of game types and platforms.",
    outcomes: ["Build, test, and document analog and digital prototypes based on theory-driven design techniques", "Apply the principles of modern game development through the creation of creative assets and supporting materials", "Contribute to working games and prototypes requiring team management, effective planning, and communication", "Create modern portfolio demonstrating viable capability utilizing games and class projects"],
    courses: [{ code: "GAM-1", category: "core" }, { code: "GAM-2", category: "core" }, { code: "GAM-3A", category: "core" }, { code: "GAM-3B", category: "core" }, { code: "GAM-4A", category: "core" }, { code: "GAM-5A", category: "core" }, { code: "GAM-6A", category: "core" }, { code: "GAM-7", category: "core" }, { code: "GAM-8", category: "core" }],
  },
  {
    name: "Game Development - Game Programming",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Math, Engineering, Computer Science & Game Development",
    total_units: 27,
    description: "Students will be well versed in the process by which games and game assets are designed and created, with a special emphasis on how they are programmatically constructed. Students will be capable of building complete simple games and intermediate game systems that integrate with large programs.",
    outcomes: ["Build simple to intermediate game systems using logic and programming using modern game development software", "Apply the principles of modern game development through the creation of creative assets and supporting materials", "Contribute to working games and prototypes requiring team management, effective planning, and communication", "Create modern portfolio demonstrating viable capability utilizing games and class projects"],
    courses: [{ code: "GAM-1", category: "core" }, { code: "GAM-2", category: "core" }, { code: "GAM-3A", category: "core" }, { code: "GAM-4A", category: "core" }, { code: "GAM-4B", category: "core" }, { code: "GAM-5A", category: "core" }, { code: "GAM-6A", category: "core" }, { code: "GAM-7", category: "core" }, { code: "GAM-8", category: "core" }],
  },
  {
    name: "Game Development - Game Development Core",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Math, Engineering, Computer Science & Game Development",
    total_units: 21,
    description: "Students will be well versed in the process by which games and game assets are designed and created, exploring a breadth of topics spanning the core disciplines of games creation. Students will be prepared to enter the field as junior designers, programmers, artists, and producers.",
    outcomes: ["Apply the principles of modern game development through the creation of creative assets and supporting materials", "Contribute to working games and prototypes requiring team management, effective planning, and communication", "Develop content that contributes and adds value to games projects or portfolio", "Create modern portfolio demonstrating viable capability utilizing games and class projects"],
    courses: [{ code: "GAM-1", category: "core" }, { code: "GAM-2", category: "core" }, { code: "GAM-3A", category: "core" }, { code: "GAM-4A", category: "core" }, { code: "GAM-5A", category: "core" }, { code: "GAM-6A", category: "core" }, { code: "GAM-7", category: "core" }],
  },
  {
    name: "Game Development - Game Concept Art",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Math, Engineering, Computer Science & Game Development",
    total_units: 27,
    description: "Students will be well versed in the process by which games and game assets are designed and created, with a special emphasis on how visual development influences game design and aesthetic. Students will be capable of designing and visually articulating a range of asset types spanning props, environments, characters and more.",
    outcomes: ["Articulate visual direction of various game-targeted assets through concept ideation and rendering", "Apply the principles of modern game development through the creation of creative assets", "Contribute to working games and prototypes requiring team management, effective planning, and communication", "Create modern portfolio demonstrating viable capability utilizing games and class projects"],
    courses: [{ code: "GAM-1", category: "core" }, { code: "GAM-2", category: "core" }, { code: "GAM-3A", category: "core" }, { code: "GAM-4A", category: "core" }, { code: "GAM-5A", category: "core" }, { code: "GAM-5B", category: "core" }, { code: "GAM-6A", category: "core" }, { code: "GAM-7", category: "core" }, { code: "GAM-8", category: "core" }],
  },
  {
    name: "Game Development - 3D Game Modeling and Animation",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Math, Engineering, Computer Science & Game Development",
    total_units: 27,
    description: "Students will be well versed in the process by which games and game assets are designed and created, with a special emphasis on how 3D game assets are constructed and integrated. Students will be capable of building a variety of 3D asset types ranging from simple static props to intermediate animated objects.",
    outcomes: ["Build modeled, textured, rigged, and animated 3D game assets using modern software and techniques", "Apply the principles of modern game development through the creation of creative assets and supporting materials", "Contribute to working games and prototypes requiring team management, effective planning, and communication", "Create modern portfolio demonstrating viable capability utilizing games and class projects"],
    courses: [{ code: "GAM-1", category: "core" }, { code: "GAM-2", category: "core" }, { code: "GAM-3A", category: "core" }, { code: "GAM-4A", category: "core" }, { code: "GAM-5A", category: "core" }, { code: "GAM-6A", category: "core" }, { code: "GAM-6B", category: "core" }, { code: "GAM-7", category: "core" }, { code: "GAM-8", category: "core" }],
  },
  {
    name: "Music Industry Studies - Audio Production",
    degree_type: "A.S. Degree | Certificate of Achievement",
    cluster: "School of Visual & Performing Arts",
    total_units: 37,
    description: "Designed to provide students with the knowledge and skills necessary for producing popular music and engineering in the recording studio as well as for live sound. Students become proficient on a DAW, gain experience recording and producing music on digital and analog devices, and record and mix in a state-of-the-art multi-track digital recording studio.",
    outcomes: ["Demonstrate an understanding of musicianship and music theory", "Employ music technology to create and refine musical product", "Sensitively enhance multitrack recordings and live performances as a mixing engineer", "Collaborate effectively with peers to create new musical works that exhibit quality and craftsmanship"],
    courses: [{ code: "MIS-1A", category: "core" }, { code: "MIS-1B", category: "core" }, { code: "MIS-1C", category: "core" }, { code: "MUS-3", category: "core" }, { code: "MUS-93", category: "core" }, { code: "MIS-3", category: "elective" }, { code: "MIS-2", category: "elective", optional: true }, { code: "MIS-4", category: "elective", optional: true }, { code: "MIS-7", category: "elective", optional: true }, { code: "MIS-12", category: "elective", optional: true }, { code: "MIS-13", category: "elective", optional: true }],
  },
  {
    name: "Music Industry Studies - Performance",
    degree_type: "A.A. Degree | Certificate of Achievement",
    cluster: "School of Visual & Performing Arts",
    total_units: 36,
    description: "Designed to provide students with the knowledge and skills necessary for studio recording and live performance in the commercial music industry. Students become proficient on an instrument or voice, gain experience as an ensemble member, and study the fundamentals of music including sight-reading, piano skills, and digital/analog music technology.",
    outcomes: ["Demonstrate an understanding of musicianship and music theory", "Employ music technology to create and refine musical product", "Sensitively interpret and communicate musical literature as a performer or studio musician", "Collaborate effectively with peers to create new musical works exhibiting quality and craftsmanship"],
    courses: [{ code: "MIS-1A", category: "core" }, { code: "MIS-1B", category: "core" }, { code: "MIS-1C", category: "core" }, { code: "MUS-3", category: "core" }, { code: "MUS-93", category: "core" }, { code: "MUS-39", category: "core" }, { code: "MUS-79", category: "core" }, { code: "MUS-41", category: "core" }, { code: "MIS-3", category: "elective", optional: true }, { code: "MIS-7", category: "elective", optional: true }, { code: "MUS-4", category: "elective", optional: true }],
  },
];

// ── Generate SQL ──────────────────────────────────────────────────────────────
const lines = [];
lines.push("-- Bulk insert: 30 new program pathway maps");
lines.push("-- Generated from 2026-2027 Norco College catalog");
lines.push("-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/exuretutssbihksumeyo/sql\n");
lines.push("DO $$");
lines.push("DECLARE");
lines.push("  prog_id uuid;");
lines.push("BEGIN\n");

for (const prog of PROGRAMS) {
  const slug = makeSlug(prog.name);
  const outcomesJson = JSON.stringify(prog.outcomes).replace(/'/g, "''");

  lines.push(`  -- ── ${prog.name} ──────────────`);
  lines.push(`  INSERT INTO programs (slug, name, degree_type, cluster, total_units, description, outcomes)`);
  lines.push(`  VALUES (`);
  lines.push(`    ${sq(slug)},`);
  lines.push(`    ${sq(prog.name)},`);
  lines.push(`    ${sq(prog.degree_type)},`);
  lines.push(`    ${sq(prog.cluster)},`);
  lines.push(`    ${prog.total_units},`);
  lines.push(`    ${sq(prog.description)},`);
  lines.push(`    '${outcomesJson}'::jsonb`);
  lines.push(`  ) ON CONFLICT (slug) DO NOTHING`);
  lines.push(`  RETURNING id INTO prog_id;\n`);
  lines.push(`  IF prog_id IS NOT NULL THEN`);

  const enriched = prog.courses.map((c) => {
    const det = info(c.code);
    return { ...c, title: det.title, units: det.units, description: det.description, prerequisite: det.prerequisite };
  });
  const withSems = assignSemesters(enriched);

  for (let i = 0; i < withSems.length; i++) {
    const c = withSems[i];
    lines.push(`    INSERT INTO courses (program_id, code, title, units, year, semester, category, prerequisite, satisfies, description, optional, note, sort_order)`);
    lines.push(`    VALUES (`);
    lines.push(`      prog_id, ${sq(c.code)}, ${sq(c.title)}, ${c.units}, ${c.year}, ${sq(c.semester)},`);
    lines.push(`      ${sq(c.category || "core")}, ${sq(c.prerequisite)}, '[]'::jsonb,`);
    lines.push(`      ${sq(c.description)}, ${c.optional ? "true" : "false"}, NULL, ${i}`);
    lines.push(`    );`);
  }

  lines.push(`  END IF;\n`);
}

lines.push("END $$;");
lines.push("\n-- Verify");
lines.push("SELECT name, cluster, total_units FROM programs ORDER BY cluster, name;");

const sql = lines.join("\n");
fs.writeFileSync("./supabase/migrations/20260617000000_bulk_programs.sql", sql);
console.error(`SQL written to supabase/migrations/20260617000000_bulk_programs.sql`);
console.error(`Programs: ${PROGRAMS.length}`);
console.error(`Total course rows: ${PROGRAMS.reduce((a, p) => a + p.courses.length, 0)}`);
