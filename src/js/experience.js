// Experience Section JavaScript
class ExperienceManager {
  constructor() {
    this.selectedExperience = null;
    this.experiences = [];
    this.container = null;
    
    // Icons usando símbolos Unicode
    this.icons = {
      briefcase: '💼',
      calendar: '📅',
      mapPin: '📍',
      chevronRight: '▶',
      close: '✕'
    };
    
    this.init();
  }

  async init() {
    this.container = document.getElementById('experience-container');
    if (!this.container) {
      console.error('Container #experience-container não encontrado');
      return;
    }

    try {
      await this.loadExperiences();
      this.renderExperiences();
    } catch (error) {
      console.error('Erro ao carregar experiências:', error);
      this.renderError();
    }
  }

  async loadExperiences() {
    try {
      const response = await fetch('./src/data/experience.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.experiences = await response.json();
    } catch (error) {
      console.error('Erro ao carregar arquivo JSON:', error);
      throw error;
    }
  }

  renderExperiences() {
    this.container.innerHTML = '';
    
    this.experiences.forEach(experience => {
      const experienceElement = this.createExperienceElement(experience);
      this.container.appendChild(experienceElement);
    });
  }

  createExperienceElement(experience) {
    const experienceDiv = document.createElement('div');
    experienceDiv.className = 'experience-item';
    experienceDiv.setAttribute('data-id', experience.id);
    
    experienceDiv.innerHTML = `
      <div class="experience-compact color-${experience.color}">
        <div class="compact-content">
          <div class="compact-info">
            <div class="company-info">
              <div class="company-icon">${experience.logo}</div>
              <div class="company-details">
                <h3>${experience.company}</h3>
                <p class="role">${experience.role}</p>
              </div>
            </div>
            
            <div class="period-info">
              <span>${this.icons.calendar}</span>
              <span>${experience.start} - ${experience.end}</span>
            </div>
            
            <div class="location-info">
              <span>${this.icons.mapPin}</span>
              <span>${experience.location}</span>
            </div>
          </div>
          
          <div class="expand-icon" id="icon-${experience.id}">
            ${this.icons.chevronRight}
          </div>
        </div>
      </div>

      <div class="experience-expanded color-${experience.color}" id="expanded-${experience.id}">
        <div class="expanded-content">
          <img src="${experience.image}" alt="${experience.company}" class="experience-image" 
               onerror="this.style.display='none'">
          
          <div class="content-grid">
            <div class="description-section">
              <h4>Descrição da Função</h4>
              <p class="description-text">${experience.description}</p>
            </div>

            <div class="skills-section">
              <h4>Habilidades Desenvolvidas</h4>
              <div class="skills-list">
                ${experience.skills.map(skill => 
                  `<span class="skill-tag">${skill}</span>`
                ).join('')}
              </div>

              <div class="duration-card">
                <div class="duration-info">
                  <p>Período de Trabalho</p>
                  <p>${experience.start} - ${experience.end}</p>
                </div>
                <div class="duration-icon">
                  ${this.icons.calendar}
                </div>
              </div>
            </div>
          </div>

          <div class="close-button-container">
            <button class="close-button" onclick="experienceManager.closeExperience()">
              <span>${this.icons.close}</span>
              <span>Fechar</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Adicionar event listener para o clique
    const compactElement = experienceDiv.querySelector('.experience-compact');
    compactElement.addEventListener('click', () => {
      this.toggleExperience(experience.id);
    });

    return experienceDiv;
  }

  toggleExperience(id) {
    const wasSelected = this.selectedExperience === id;
    
    // Fechar experiência selecionada atualmente
    if (this.selectedExperience) {
      this.closeExperience();
    }
    
    // Se clicando em uma experiência diferente, abri-la
    if (!wasSelected) {
      this.selectedExperience = id;
      const compactElement = document.querySelector(`[data-id="${id}"] .experience-compact`);
      const expandedElement = document.getElementById(`expanded-${id}`);
      const iconElement = document.getElementById(`icon-${id}`);
      
      if (compactElement && expandedElement && iconElement) {
        compactElement.classList.add('expanded');
        expandedElement.classList.add('open');
        iconElement.classList.add('rotated');
        
        // Scroll suave para a experiência expandida
        setTimeout(() => {
          compactElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
          });
        }, 100);
      }
    }
  }

  closeExperience() {
    if (this.selectedExperience) {
      const compactElement = document.querySelector(`[data-id="${this.selectedExperience}"] .experience-compact`);
      const expandedElement = document.getElementById(`expanded-${this.selectedExperience}`);
      const iconElement = document.getElementById(`icon-${this.selectedExperience}`);
      
      if (compactElement && expandedElement && iconElement) {
        compactElement.classList.remove('expanded');
        expandedElement.classList.remove('open');
        iconElement.classList.remove('rotated');
      }
      
      this.selectedExperience = null;
    }
  }

  renderError() {
    this.container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #666;">
        <p>Erro ao carregar as experiências. Verifique se o arquivo JSON está disponível.</p>
        <button onclick="experienceManager.init()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #00BDD2; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Tentar Novamente
        </button>
      </div>
    `;
  }
}

// Inicializar quando o DOM estiver carregado
let experienceManager;

document.addEventListener('DOMContentLoaded', () => {
  experienceManager = new ExperienceManager();
});

// Fechar experiência quando clicar fora
document.addEventListener('click', (event) => {
  if (experienceManager && experienceManager.selectedExperience) {
    const experienceContainer = document.getElementById('experience-container');
    if (experienceContainer && !experienceContainer.contains(event.target)) {
      experienceManager.closeExperience();
    }
  }
});

// Exportar para uso global
window.experienceManager = experienceManager;z