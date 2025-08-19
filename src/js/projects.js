// project Section JavaScript
class ProjectManager {
  constructor() {
    this.selectedproject = null;
    this.projects = [];
    this.container = null;
    
    // Icons usando símbolos Unicode
    this.icons = {
      briefcase: '💼',
      calendar: '📅',
      link: '🔗',
      chevronRight: '▶',
      close: '✕'
    };
    
    this.init();
  }

  async init() {
    this.container = document.getElementById('project-container');
    if (!this.container) {
      console.error('Container #project-container não encontrado');
      return;
    }

    try {
      await this.loadprojects();
      this.renderprojects();
    } catch (error) {
      console.error('Erro ao carregar experiências:', error);
      this.renderError();
    }
  }

  async loadprojects() {
    try {
      const response = await fetch('./src/data/projects.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.projects = await response.json();
    } catch (error) {
      console.error('Erro ao carregar arquivo JSON:', error);
      throw error;
    }
  }

  renderprojects() {
    this.container.innerHTML = '';
    
    this.projects.forEach(project => {
      const projectElement = this.createprojectElement(project);
      this.container.appendChild(projectElement);
    });
  }

createprojectElement(project) {
  const projectDiv = document.createElement('div');
  projectDiv.className = 'project-item';
  projectDiv.setAttribute('data-id', project.id_project);
  
  projectDiv.innerHTML = `
    <div class="project-compact color-${project.color}">
      <div class="compact-content">
        <div class="compact-info">
          <div class="project-info">
            <div class="project-icon">${project.logo}</div>
            <div class="project-details">
              <h3>${project.name_project}</h3>
              <p class="role">${project.subtitle}</p>
            </div>
          </div>
          
          <div class="period-info">
            <span>${this.icons.calendar}</span>
            <span>${project.start} - ${project.end}</span>
          </div>

<div class="hiperlink-info">
  <span>${this.icons.link}</span>
  <a href="${project.hiperlink}" target="_blank" style="color: #666;">Link do Projeto</a>
</div>
</div>

        
        <div class="expand-icon" id="project-icon-${project.id_project}">
          ${this.icons.chevronRight}
        </div>
      </div>
    </div>

    <div class="project-expanded color-${project.color}" id="project-expanded-${project.id_project}">
      <div class="expanded-content">
        <img src="${project.image}" alt="${project.name_project}" class="project-image" 
             onerror="this.style.display='none'">
        
        <div class="content-grid">
          <div class="description-section">
            <h4>Descrição do Projeto</h4>
            <p class="description-text">${project.description}</p>
          </div>

          <div class="skills-section">
            <h4>Tecnologias Utilizadas</h4>
            <div class="skills-list">
              ${project.tecnologias.map(skill => 
                `<span class="skill-tag">${skill}</span>`
              ).join('')}
            </div>

            <div class="duration-card">
              <div class="duration-info">
                <p>Período de Desenvolvimento</p>
                <p>${project.start} - ${project.end}</p>
              </div>
              <div class="duration-icon">
                ${this.icons.calendar}
              </div>
            </div>
          </div>
        </div>

        <div class="close-button-container">
          <button class="close-button" onclick="projectManager.closeproject()">
            <span>${this.icons.close}</span>
            <span>Fechar</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // Adicionar event listener para o clique
  const compactElement = projectDiv.querySelector('.project-compact');
  compactElement.addEventListener('click', () => {
    this.toggleproject(project.id_project);
  });

  return projectDiv;
}

toggleproject(id_project) {
  const wasSelected = this.selectedproject === id_project;
  
  if (this.selectedproject) {
    this.closeproject();
  }
  
  if (!wasSelected) {
    this.selectedproject = id_project;
    const compactElement = this.container.querySelector(`[data-id="${id_project}"] .project-compact`);
    const expandedElement = document.getElementById(`project-expanded-${id_project}`);
    const iconElement = document.getElementById(`project-icon-${id_project}`);
    
    if (compactElement && expandedElement && iconElement) {
      compactElement.classList.add('expanded');
      expandedElement.classList.add('open');
      iconElement.classList.add('rotated');
      
      setTimeout(() => {
        compactElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }, 100);
    }
  }
}

closeproject() {
  if (this.selectedproject) {
    const compactElement = this.container.querySelector(`[data-id="${this.selectedproject}"] .project-compact`);
    const expandedElement = document.getElementById(`project-expanded-${this.selectedproject}`);
    const iconElement = document.getElementById(`project-icon-${this.selectedproject}`);
    
    if (compactElement && expandedElement && iconElement) {
      compactElement.classList.remove('expanded');
      expandedElement.classList.remove('open');
      iconElement.classList.remove('rotated');
    }
    
    this.selectedproject = null;
  }
}

  renderError() {
    this.container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #666;">
        <p>Erro ao carregar as experiências. Verifique se o arquivo JSON está disponível.</p>
        <button onclick="projectManager.init()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #00BDD2; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Tentar Novamente
        </button>
      </div>
    `;
  }
}

let projectManager;

document.addEventListener('DOMContentLoaded', () => {
  projectManager = new ProjectManager();
});

document.addEventListener('click', (event) => {
  if (projectManager && projectManager.selectedproject) {
    const projectContainer = document.getElementById('project-container');
    if (projectContainer && !projectContainer.contains(event.target)) {
      projectManager.closeproject();
    }
  }
});

window.projectManager = projectManager;
