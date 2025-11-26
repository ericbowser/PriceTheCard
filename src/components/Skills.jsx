import React from 'react';
import { RiJavascriptLine } from "react-icons/ri";
import { FaReact, FaNodeJs, FaGithub, FaServer, FaMicrosoft } from "react-icons/fa";
import { SiPostgresql } from "react-icons/si";
import { PiFileSql, PiFileCssLight } from "react-icons/pi";
import { BsGearFill } from "react-icons/bs";

const Skills = [
  {
    key: 'javascript',
    title: 'JavaScript',
    level: 'expert',
    description: (
      <p>
        Expert in modern JavaScript development with strong knowledge of ES6+ features, async programming, and frontend frameworks.
      </p>
    ),
    details: (
      <div className="space-y-2">
        <p>
          With over 8 years of JavaScript experience, I've built complex single-page applications and RESTful APIs. I'm proficient in modern ES6+ syntax, asynchronous programming patterns, and performance optimization.
        </p>
        <p>
          I have extensive experience with NPM for package management and am skilled at writing clean, maintainable JavaScript code following best practices. I regularly work with promises, async/await, and functional programming techniques.
        </p>
      </div>
    ),
    relatedTech: ['ES6+', 'TypeScript', 'Promises', 'Async/Await', 'Webpack', 'Babel', 'Jest'],
    image: null,
    link: [
      {
        name: 'AI Assistant Frontend',
        url: 'https://github.com/ericbowser/AssistFront'
      }
    ],
    icon: <RiJavascriptLine size={30} color={'red'}/>
  },
  {
    key: 'react',
    title: 'React',
    level: 'expert',
    description: (
      <p>
        Experienced React developer with expertise in building modern, responsive user interfaces using hooks, context, and component patterns.
      </p>
    ),
    details: (
      <div className="space-y-2">
        <p>
          I have deep experience with React, from class components to the latest hooks and context API. I'm skilled at building reusable component libraries and implementing complex state management solutions.
        </p>
        <p>
          I've worked extensively with React Router for SPA navigation, Redux and Context API for state management, and am proficient with optimizing React applications for performance using memoization, code splitting, and lazy loading.
        </p>
      </div>
    ),
    relatedTech: ['Hooks', 'Context API', 'Redux', 'React Router', 'Next.js', 'React Query', 'Testing Library'],
    image: null,
    link: [
      {
        name: 'Portfolio Site',
        url: 'https://github.com/ericbowser/my-portfolio'
      },
      {
        name: 'Card Game',
        url: 'https://github.com/ericbowser/CardGame'
      }
    ],
    icon: <FaReact size={30} color={'rgb(88 196 220/var(--tw-text-opacity))'} />
  },
  {
    key: 'csharp',
    title: 'C#/.NET',
    level: 'expert',
    description: (
      <p>
        Proficient in C# development with extensive experience in .NET Core, ASP.NET MVC, Web API and microservices architecture.
      </p>
    ),
    details: (
      <div className="space-y-2">
        <p>
          I've developed numerous enterprise applications using C# and the .NET ecosystem, from .NET Framework to the latest .NET Core versions. I have experience building RESTful APIs, MVC applications, and microservices.
        </p>
        <p>
          I'm skilled in LINQ, Entity Framework, and Dapper for data access, and have implemented authentication with JWT, OAuth, and Microsoft Identity. I follow SOLID principles and design patterns to create maintainable, testable code.
        </p>
      </div>
    ),
    relatedTech: ['ASP.NET Core', 'EF Core', 'Dapper', 'LINQ', 'MVC', 'Web API', 'Dependency Injection'],
    image: null,
    link: [],
    icon: <FaMicrosoft size={30} color={'blue'}/>
  },
  {
    key: 'node',
    title: 'Node.js',
    level: 'advanced',
    description: (
      <p>
        Skilled in server-side JavaScript development with Node.js, building RESTful APIs and microservices with Express.js.
      </p>
    ),
    details: (
      <div className="space-y-2">
        <p>
          I have built and maintained several Node.js applications, focusing on RESTful API development with Express.js. I'm experienced with asynchronous programming patterns, middleware implementation, and API security best practices.
        </p>
        <p>
          I've implemented authentication using JWT, session management, and have experience with database integration using ORMs like Sequelize and MongoDB with Mongoose. I'm also familiar with testing Node.js applications using Jest and Mocha.
        </p>
      </div>
    ),
    relatedTech: ['Express.js', 'REST APIs', 'JWT', 'Sequelize', 'Mongoose', 'Jest', 'PM2'],
    image: null,
    link: [
      {
        name: 'AI Assistant Backend',
        url: 'https://github.com/ericbowser/Assist'
      },
      {
        name: 'Pet Tags Backend',
        url: 'https://github.com/ericbowser/backendlaser'
      }
    ],
    icon: <FaNodeJs size={30} color={'green'}/>
  },
  {
    key: 'css',
    title: 'CSS/UI',
    level: 'advanced',
    description: (
      <p>
        Proficient in modern CSS techniques including Flexbox, Grid, and CSS frameworks like Tailwind CSS and Bootstrap.
      </p>
    ),
    details: (
      <div className="space-y-2">
        <p>
          I create responsive, accessible, and visually appealing interfaces using modern CSS techniques. I'm experienced with CSS frameworks like Tailwind CSS and Bootstrap, as well as CSS preprocessors like SASS.
        </p>
        <p>
          I implement responsive designs that work across all device sizes and browsers, and am skilled at creating custom animations and transitions that enhance user experience without sacrificing performance.
        </p>
      </div>
    ),
    relatedTech: ['Tailwind CSS', 'Bootstrap', 'SASS/SCSS', 'Flexbox', 'CSS Grid', 'Responsive Design', 'Animations'],
    image: null,
    link: [],
    icon: <PiFileCssLight size={30} color={'purple'} />
  },
  {
    key: 'database',
    title: 'Database',
    level: 'advanced',
    description: (
      <p>
        Experienced with relational and NoSQL databases, including SQL Server, PostgreSQL, and MongoDB, with skills in query optimization and schema design.
      </p>
    ),
    details: (
      <div className="space-y-2">
        <p>
          I've worked extensively with Microsoft SQL Server and PostgreSQL, designing efficient schemas, writing complex queries, stored procedures, and user-defined functions. I'm skilled at query optimization and performance tuning.
        </p>
        <p>
          I have experience with NoSQL solutions like MongoDB and Cosmos DB, and am comfortable with both ORM approaches (Entity Framework, Sequelize) and micro-ORMs like Dapper for data access.
        </p>
      </div>
    ),
    relatedTech: ['SQL Server', 'PostgreSQL', 'T-SQL', 'Stored Procedures', 'Entity Framework', 'Dapper', 'Cosmos DB'],
    image: null,
    link: [],
    icon: <div className="flex space-x-1">
      <SiPostgresql size={30} color={'blue'}/>
      <PiFileSql size={30} color={'red'}/>
    </div>
  },
  {
    key: 'cicd',
    title: 'CI/CD',
    level: 'advanced',
    description: (
      <p>
        Proficient with DevOps practices and CI/CD pipelines using Azure DevOps, TeamCity, and GitHub Actions.
      </p>
    ),
    details: (
      <div className="space-y-2">
        <p>
          I've implemented and maintained CI/CD pipelines using Azure DevOps, TeamCity, and Octopus Deploy. I'm experienced in automating build processes, testing, and deployments to ensure consistent and reliable software delivery.
        </p>
        <p>
          I follow DevOps best practices, including infrastructure as code, automated testing, and continuous monitoring. I've created custom build scripts using PowerShell, Bash, and Cake Build.
        </p>
      </div>
    ),
    relatedTech: ['Azure DevOps', 'TeamCity', 'Octopus Deploy', 'GitHub Actions', 'Cake Build', 'PowerShell', 'Bash'],
    image: null,
    link: [],
    icon: <BsGearFill size={30} color={'orange'} />
  },
  {
    key: 'cloud',
    title: 'Cloud',
    level: 'intermediate',
    description: (
      <p>
        Experience with cloud platforms including Microsoft Azure and Google Cloud, with skills in containerization and serverless architecture.
      </p>
    ),
    details: (
      <div className="space-y-2">
        <p>
          I've worked with Microsoft Azure services including App Service, Functions, SQL Database, Storage, and Azure DevOps. I'm familiar with deploying and managing cloud resources using both the Azure portal and Infrastructure as Code.
        </p>
        <p>
          I have experience with containerization using Docker and orchestration with Kubernetes, as well as serverless computing patterns using Azure Functions and Logic Apps.
        </p>
      </div>
    ),
    relatedTech: ['Azure', 'App Service', 'Azure Functions', 'Storage', 'Docker', 'Kubernetes', 'IaC'],
    image: null,
    link: [],
    icon: <FaMicrosoft size={30} color={'linear-gradient(to right, #f25022, #7fba00, #00a4ef, #ffb900)'}/>
  },
  {
    key: 'git',
    title: 'Git & Source Control',
    level: 'expert',
    description: (
      <p>
        Expert with Git version control, GitHub workflows, branching strategies, and collaborative development practices.
      </p>
    ),
    details: (
      <div className="space-y-2">
        <p>
          I have extensive experience with Git for version control, including managing complex merges, rebasing, and resolving conflicts. I'm proficient with GitHub for collaborative development, pull requests, and code reviews.
        </p>
        <p>
          I follow Git Flow and GitHub Flow branching strategies and am experienced with Git CLI for advanced operations. I maintain clean commit histories and follow best practices for collaborative development.
        </p>
      </div>
    ),
    relatedTech: ['Git', 'GitHub', 'GitFlow', 'Pull Requests', 'Code Reviews', 'Branching Strategies', 'Git CLI'],
    image: null,
    link: [],
    icon: <FaGithub size={30} color={'black'} />
  },
  {
    key: 'microservices',
    title: 'Architecture',
    level: 'advanced',
    description: (
      <p>
        Experienced with microservices architecture, API design, and software development methodologies like SOLID and design patterns.
      </p>
    ),
    details: (
      <div className="space-y-2">
        <p>
          I've designed and implemented microservices architectures using .NET Core and Node.js, with a focus on service boundaries, API contracts, and inter-service communication patterns like message queues and event-driven architecture.
        </p>
        <p>
          I follow SOLID principles and common design patterns to create maintainable, testable code. I have experience with domain-driven design (DDD) and am skilled at designing RESTful APIs that are intuitive and well-documented.
        </p>
      </div>
    ),
    relatedTech: ['Microservices', 'API Design', 'SOLID', 'Design Patterns', 'DDD', 'Event-Driven', 'REST'],
    image: null,
    link: [],
    icon: <FaServer size={30} color={'blue'}/>
  }
];

export default Skills;