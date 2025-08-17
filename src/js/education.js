// education Section JavaScript
class EducationManager {
  constructor() {
    this.selectedEducation = null;
    this.educations = [];
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
    this.container = document.getElementById('education-container');
    if (!this.container) {
      console.error('Container #education-container não encontrado');
      return;
    }

    try {
      await this.loadeducations();
      this.rendereducations();
    } catch (error) {
      console.error('Erro ao carregar experiências:', error);
      this.renderError();
    }
  }

  async loadeducations() {
    try {
      const response = await fetch('./src/data/education.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.educations = await response.json();
    } catch (error) {
      console.error('Erro ao carregar arquivo JSON:', error);
      throw error;
    }
  }

  rendereducations() {
    this.container.innerHTML = '';
    
    this.educations.forEach(education => {
      const educationElement = this.createeducationElement(education);
      this.container.appendChild(educationElement);
    });
  }

createeducationElement(education) {
  const educationDiv = document.createElement('div');
  educationDiv.className = 'education-item';
  educationDiv.setAttribute('data-id', education.id_institution);
  
  educationDiv.innerHTML = `
    <div class="education-compact color-${education.color}">
      <div class="compact-content">
        <div class="compact-info">
          <div class="institution-info">
            <div class="institution-icon">${education.logo}</div>
            <div class="institution-details">
              <h3>${education.institution}</h3>
              <p class="role">${education.name}</p>
            </div>
          </div>
          
          <div class="period-info">
            <span>${this.icons.calendar}</span>
            <span>${education.start} - ${education.end}</span>
          </div>
          
          <div class="location-info">
            <span>${this.icons.mapPin}</span>
            <span>${education.location}</span>
          </div>
        </div>
        
        <div class="expand-icon" id="education-icon-${education.id_institution}">
          ${this.icons.chevronRight}
        </div>
      </div>
    </div>

    <div class="education-expanded color-${education.color}" id="education-expanded-${education.id_institution}">
      <div class="expanded-content">
        <img src="${education.image}" alt="${education.institution}" class="education-image" 
             onerror="this.style.display='none'">
        
        <div class="content-grid">
          <div class="description-section">
            <h4>Descrição da Função</h4>
            <p class="description-text">${education.description}</p>
          </div>

          <div class="skills-section">
            <h4>Habilidades Desenvolvidas</h4>
            <div class="skills-list">
              ${education.skills.map(skill => 
                `<span class="skill-tag">${skill}</span>`
              ).join('')}
            </div>

            <div class="duration-card">
              <div class="duration-info">
                <p>Período de Estudos</p>
                <p>${education.start} - ${education.end}</p>
              </div>
              <div class="duration-icon">
                ${this.icons.calendar}
              </div>
            </div>
          </div>
        </div>

        <div class="close-button-container">
          <button class="close-button" onclick="educationManager.closeeducation()">
            <span>${this.icons.close}</span>
            <span>Fechar</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // Adicionar event listener para o clique
  const compactElement = educationDiv.querySelector('.education-compact');
  compactElement.addEventListener('click', () => {
    this.toggleeducation(education.id_institution);
  });

  return educationDiv;
}

toggleeducation(id_institution) {
  const wasSelected = this.selectedEducation === id_institution;
  
  if (this.selectedEducation) {
    this.closeeducation();
  }
  
  if (!wasSelected) {
    this.selectedEducation = id_institution;
    const compactElement = this.container.querySelector(`[data-id="${id_institution}"] .education-compact`);
    const expandedElement = document.getElementById(`education-expanded-${id_institution}`);
    const iconElement = document.getElementById(`education-icon-${id_institution}`);
    
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

closeeducation() {
  if (this.selectedEducation) {
    const compactElement = this.container.querySelector(`[data-id="${this.selectedEducation}"] .education-compact`);
    const expandedElement = document.getElementById(`education-expanded-${this.selectedEducation}`);
    const iconElement = document.getElementById(`education-icon-${this.selectedEducation}`);
    
    if (compactElement && expandedElement && iconElement) {
      compactElement.classList.remove('expanded');
      expandedElement.classList.remove('open');
      iconElement.classList.remove('rotated');
    }
    
    this.selectedEducation = null;
  }
}

  renderError() {
    this.container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #666;">
        <p>Erro ao carregar as experiências. Verifique se o arquivo JSON está disponível.</p>
        <button onclick="EducationManager.init()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #00BDD2; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Tentar Novamente
        </button>
      </div>
    `;
  }
}

let educationManager;

document.addEventListener('DOMContentLoaded', () => {
  educationManager = new EducationManager();
});

document.addEventListener('click', (event) => {
  if (educationManager && educationManager.selectedEducation) {
    const educationContainer = document.getElementById('education-container');
    if (educationContainer && !educationContainer.contains(event.target)) {
      educationManager.closeeducation();
    }
  }
});

window.educationManager = educationManager;
