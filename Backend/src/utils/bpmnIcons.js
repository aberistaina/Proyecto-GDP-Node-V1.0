export const bpmnIcons = {
  "bpmn:StartEvent": `
    <svg width="24" viewBox="0 0 24 24" style="fill:#e6ff97 !important; stroke:#86bb49 !important;" stroke-width="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  `,
  "bpmn:EndEvent": `
    <svg width="24" viewBox="0 0 24 24" style="fill:#eeaaaa !important; stroke:#a31515 !important;" stroke-width="3">
      <circle cx="12" cy="12" r="10" />
    </svg>
  `,
  "bpmn:IntermediateThrowEvent": `
    <svg width="24" viewBox="0 0 24 24" style="fill:#fefbf6 !important; stroke:#aba76b !important;" stroke-width="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
    </svg>
  `,
  "bpmn:UserTask": `
    <svg width="30" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg"><rect width="1700" height="1360" x="180" y="-627.638" rx="120" ry="120" transform="translate(0 947.638)" fill="#ecefff" stroke="#03689a" stroke-width="20" stroke-linecap="round"/><g transform="translate(200,380) scale(25)"><circle cx="11.7" cy="4.5" r="4" fill="#000"/><path d="M5.2 14a7 8 0 0 1 13 0" fill="#000"/></g></svg>
  `,
  "bpmn:ServiceTask": `
    <svg width="30" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg"><rect width="1700" height="1360" x="150" y="-627.638" rx="311.337" ry="306" transform="translate(0 947.638)" fill="#ecefff" stroke="#03689a" stroke-width="20" stroke-linecap="round"/><g transform="translate(280,400) scale(18)"><path fill="#1a1a1a" d="M19.14 12.936a7.966 7.966 0 000-1.872l1.847-1.435a0.5 0.5 0 00.12-0.66l-1.75-3.032a0.5 0.5 0 00-.605-0.22l-2.176 0.873a7.99 7.99 0 00-1.62-0.936l-0.33-2.33a0.5 0.5 0 00-.497-0.427h-3.5a0.5 0.5 0 00-.497 0.427l-0.33 2.33a7.99 7.99 0 00-1.62 0.936l-2.176-0.873a0.5 0.5 0 00-.605 0.22l-1.75 3.032a0.5 0.5 0 00.12 0.66l1.847 1.435a7.966 7.966 0 000 1.872l-1.847 1.435a0.5 0.5 0 00-.12 0.66l1.75 3.032a0.5 0.5 0 00.605 0.22l2.176-0.873a7.99 7.99 0 001.62 0.936l0.33 2.33a0.5 0.5 0 00.497 0.427h3.5a0.5 0.5 0 00.497-0.427l0.33-2.33a7.99 7.99 0 001.62-0.936l2.176 0.873a0.5 0.5 0 00.605-0.22l1.75-3.032a0.5 0.5 0 00-.12-0.66l-1.847-1.435zM12 15a3 3 0 110-6 3 3 0 010 6z"/></g></svg>
  `,
  "bpmn:ManualTask": `
    <svg width="30" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg"><rect width="1700" height="1360" x="150" y="-627.638" rx="311.337" ry="306" transform="translate(0 947.638)" fill="#ecefff" stroke="#03689a" stroke-width="20" stroke-linecap="round"/><g transform="translate(300,400) scale(0.4)"><path fill="#ffffff" stroke="#000000" stroke-width="10" d="M870.4 204.8c-18.64 0-36.15 5.02-51.2 13.77V153.6a102.5 102.5 0 0 0-159.39-85.04C645.79 28.67 607.8 0 563.2 0s-83.64 28.67-97.62 68.56A102.5 102.5 0 0 0 307.2 153.6v377.5L238.28 411.65a99.69 99.69 0 0 0-61.39-48.79 95.54 95.54 0 0 0-74.85 10.34c-46.44 27.85-64.15 90.83-39.42 140.39 1.54 3.12 34.2 70.04 136.19 273.92 48.03 96 100.71 164.66 156.62 203.98 43.88 30.87 74.19 32.46 79.82 32.46h256c43.57 0 84.07-14.18 120.42-42.09 34.15-26.27 63.8-64.26 88.06-112.84 47.82-95.64 73.11-227.94 73.11-382.67v-179.2c0-56.47-45.93-102.4-102.4-102.4zM921.6 486.4c0 146.79-23.4 271.16-67.69 359.73-28.87 57.75-80.58 126.66-162.7 126.66H435.71c-2-0.15-23.55-2.56-56.06-26.88-32.41-24.27-82.18-75.37-135.07-181.25C140.8 556.09 108.9 490.71 108.6 490.1c-12.85-25.75-3.74-59.49 19.92-73.68a44.85 44.85 0 0 1 35.07-4.86 48.95 48.95 0 0 1 30.06 24.17l0.31 0.51 79.92 138.5c16.33 29.85 34.71 42.39 54.63 37.32 19.97-5.07 30.06-25.04 30.06-59.24V153.6c0-28.21 22.99-51.2 51.2-51.2s51.2 22.99 51.2 51.2v332.8a25.6 25.6 0 0 0 51.2 0V102.4c0-28.21 22.99-51.2 51.2-51.2s51.2 22.99 51.2 51.2v384a25.6 25.6 0 0 0 51.2 0V153.6c0-28.21 22.99-51.2 51.2-51.2s51.2 22.99 51.2 51.2v384a25.6 25.6 0 0 0 51.2 0V307.2c0-28.21 22.99-51.2 51.2-51.2s51.2 22.99 51.2 51.2v179.2z"/></g></svg>

  `,
  "bpmn:ScriptTask": `
    <svg width="30" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg"><rect width="1700" height="1360" x="150" y="-627.638" rx="311.337" ry="306" transform="translate(0 947.638)" fill="#ecefff" stroke="#03689a" stroke-width="20" stroke-linecap="round"/><g transform="translate(280,400) scale(15)"><path d="M20.5 2h-13C6.122 2 5 3.683 5 5.75V15H3.5C2.122 15 1 16.57 1 18.5S2.122 22 3.5 22h13c1.378 0 2.5-1.683 2.5-3.75V9h1.5C21.878 9 23 7.43 23 5.5S21.878 2 20.5 2zm-17 19C2.701 21 2 19.832 2 18.5S2.701 16 3.5 16h11.057A5.635 5.635 0 0 0 14 18.5a5.578 5.578 0 0 0 .563 2.5zM18 18.25c0 1.574-.792 2.75-1.5 2.75h-.77a4.246 4.246 0 0 1-.73-2.5 4.141 4.141 0 0 1 .86-2.674l.71-.826H6V5.75C6 4.176 6.792 3 7.5 3h11.14A5.995 5.995 0 0 0 18 5.75zM20.5 8H19V5.75A4.616 4.616 0 0 1 19.823 3h.677c.799 0 1.5 1.168 1.5 2.5S21.299 8 20.5 8zM8 6h8v1H8zm0 3h8v1H8zm0 3h8v1H8z" fill="black"/></g></svg>
  `,
  "bpmn:BusinessRuleTask": `
    <svg width="30" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg"><rect width="1700" height="1360" x="150" y="-627.638" rx="311.337" ry="306" transform="translate(0 947.638)" fill="#ecefff" stroke="#03689a" stroke-width="20" stroke-linecap="round"/><g transform="translate(280,360) scale(18)"><rect x="3" y="4" width="18" height="5" fill="#1a1a1a"/><rect x="3" y="9" width="9" height="5" fill="#ffffff" stroke="#000" stroke-width="1"/><rect x="12" y="9" width="9" height="5" fill="#ffffff" stroke="#000" stroke-width="1"/><rect x="3" y="14" width="9" height="5" fill="#ffffff" stroke="#000" stroke-width="1"/><rect x="12" y="14" width="9" height="5" fill="#ffffff" stroke="#000" stroke-width="1"/><rect x="3" y="4" width="18" height="15" fill="none" stroke="#000" stroke-width="1.5"/></g></svg>

  `,
  "bpmn:SendTask": `
    <svg width="30" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg"><rect width="1700" height="1360" x="180" y="-627.638" rx="120" ry="120" transform="translate(0 947.638)" fill="#ecefff" stroke="#03689a" stroke-width="20" stroke-linecap="round"/><g transform="translate(300,400)"><rect x="0" y="0" width="360" height="220" fill="#1a1a1a"/><polyline points="0,0 180,110 360,0" fill="none" stroke="#ffffff" stroke-width="20"/></g></svg>
  `,
  "bpmn:ReceiveTask": `
    <svg width="30" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg"><rect width="1700" height="1360" x="180" y="-627.638" rx="120" ry="120" transform="translate(0 947.638)" fill="#ecefff" stroke="#03689a" stroke-width="20" stroke-linecap="round"/><g transform="translate(300,400)"><rect x="0" y="0" width="360" height="220" fill="white" stroke="black" stroke-width="20"/><polyline points="0,0 180,110 360,0" fill="none" stroke="black" stroke-width="20"/><line x1="0" y1="220" x2="360" y2="220" stroke="black" stroke-width="20"/></g></svg>

  `,
  "bpmn:CallActivity": `<svg width="30" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg"><rect width="1700" height="1360" x="150" y="-627.638" rx="311.337" ry="306" transform="translate(0 947.638)" fill="#ecefff" stroke="#03689a" stroke-width="70" stroke-linecap="round"/><g transform="translate(1000,1200)"><rect x="-140" y="-10" width="280" height="280" fill="white" stroke="black" stroke-width="20"/><g transform="translate(0,130)"><line x1="-20" y1="0" x2="20" y2="0" stroke="black" stroke-width="250"/><line x1="0" y1="-20" x2="0" y2="20" stroke="black" stroke-width="250"/></g></g></svg>`,

  "bpmn:SubProcess": `
    <svg width="24" viewBox="0 0 24 24" style="fill:#ecefff !important; stroke:#03689a !important;" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 12h6" />
    </svg>
  `,
  "bpmn:ExclusiveGateway": `
    <svg width="24" viewBox="0 0 24 24" style="fill:#ffffcc !important; stroke:#b9b94e !important;" stroke-width="2">
      <polygon points="12,2 22,12 12,22 2,12" />
      <path d="M8 8l8 8M8 16l8-8" />
    </svg>
  `,
  "bpmn:ParallelGateway": `
    <svg width="24" viewBox="0 0 24 24" style="fill:#ffffcc !important; stroke:#b9b94e !important;" stroke-width="2">
      <polygon points="12,2 22,12 12,22 2,12" />
      <path d="M12 6v12M6 12h12" />
    </svg>
  `,
  "bpmn:Task": `<svg width="30" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg"><rect width="1700" height="1360" x="150" y="-627.638" rx="311.337" ry="306" transform="translate(0 947.638)" fill="#ecefff" stroke="#03689a" stroke-width="20" stroke-linecap="round"/></svg>`
};

