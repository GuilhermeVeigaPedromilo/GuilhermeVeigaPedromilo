// certification Section JavaScript
class CertificationManager {
  constructor() {
    this.selectedcertification = null;
    this.certifications = [];
    this.container = null;
    
    // Icons usando símbolos Unicode
    this.icons = {
      briefcase: '💼',
      calendar: '📅',
      mapPin: '📍',
      link: '🔗',
      chevronRight: '▶',
      close: '✕'
    };
    
    this.init();
  }

  async init() {
    this.container = document.getElementById('certification-container');
    if (!this.container) {
      console.error('Container #certification-container não encontrado');
      return;
    }

    try {
      await this.loadcertifications();
      this.rendercertifications();
    } catch (error) {
      console.error('Erro ao carregar experiências:', error);
      this.renderError();
    }
  }

  async loadcertifications() {
    try {
      const response = await fetch('./src/data/certification.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.certifications = await response.json();
    } catch (error) {
      console.error('Erro ao carregar arquivo JSON:', error);
      throw error;
    }
  }

  rendercertifications() {
    this.container.innerHTML = '';
    
    this.certifications.forEach(certification => {
      const certificationElement = this.createcertificationElement(certification);
      this.container.appendChild(certificationElement);
    });
  }

createcertificationElement(certification) {
  const certificationDiv = document.createElement('div');
  certificationDiv.className = 'certification-item';
  certificationDiv.setAttribute('data-id', certification.id_certification);
  
  certificationDiv.innerHTML = `
    <div class="certification-compact color-${certification.color}">
      <div class="compact-content">
        <div class="compact-info">
          <div class="institution-info">
            <div class="institution-icon">${certification.logo}</div>
            <div class="institution-details">
              <h3>${certification.name}</h3>
              <p class="role">${certification.institution}</p>
            </div>
          </div>
          
          <div class="period-info">
            <span>${this.icons.calendar}</span>
            <span>${certification.start} - ${certification.end}</span>
          </div>
          
          <div class="location-info">
            <span>${this.icons.mapPin}</span>
            <span>${certification.location}</span>
          </div>
        </div>
        
        <div class="expand-icon" id="certification-icon-${certification.id_certification}">
          ${this.icons.chevronRight}
        </div>
      </div>
    </div>

    <div class="certification-expanded color-${certification.color}" id="certification-expanded-${certification.id_certification}">
      <div class="expanded-content">
        <img src="${certification.image}" alt="${certification.institution}" class="certification-image" 
             onerror="this.style.display='none'">
        
        <div class="content-grid">
          <div class="description-section">
            <h4>Descrição da ${certification.type}</h4>
            <p class="description-text">${certification.description}</p>
            
      ${certification.hiperlinks ? `
            <h4 style="margin-top: 32px">Links Relacionados</h4>
${certification.hiperlinks.map(hiperlink => `
    <p class="description-text">
      ${this.icons.link} <a href="${hiperlink.link}" style="color: #666">${hiperlink.alt}</a>
    </p>
`).join('')}

      ` : ''}
          </div>

          <div class="skills-section">
            <h4>Habilidades Desenvolvidas</h4>
            <div class="skills-list">
              ${certification.skills.map(skill => 
                `<span class="skill-tag">${skill}</span>`
              ).join('')}
            </div>

            <div class="duration-card">
              <div class="duration-info">
                <p>Período de Estudos</p>
                <p>${certification.start} - ${certification.end}</p>
              </div>
              <div class="duration-icon">
                ${this.icons.calendar}
              </div>
            </div>
          </div>
        </div>

        <div class="close-button-container">
          <button class="close-button" onclick="certificationManager.closecertification()">
            <span>${this.icons.close}</span>
            <span>Fechar</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // Adicionar event listener para o clique
  const compactElement = certificationDiv.querySelector('.certification-compact');
  compactElement.addEventListener('click', () => {
    this.togglecertification(certification.id_certification);
  });

  return certificationDiv;
}

togglecertification(id_certification) {
  const wasSelected = this.selectedcertification === id_certification;
  
  if (this.selectedcertification) {
    this.closecertification();
  }
  
  if (!wasSelected) {
    this.selectedcertification = id_certification;
    const compactElement = this.container.querySelector(`[data-id="${id_certification}"] .certification-compact`);
    const expandedElement = document.getElementById(`certification-expanded-${id_certification}`);
    const iconElement = document.getElementById(`certification-icon-${id_certification}`);
    
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

closecertification() {
  if (this.selectedcertification) {
    const compactElement = this.container.querySelector(`[data-id="${this.selectedcertification}"] .certification-compact`);
    const expandedElement = document.getElementById(`certification-expanded-${this.selectedcertification}`);
    const iconElement = document.getElementById(`certification-icon-${this.selectedcertification}`);
    
    if (compactElement && expandedElement && iconElement) {
      compactElement.classList.remove('expanded');
      expandedElement.classList.remove('open');
      iconElement.classList.remove('rotated');
    }
    
    this.selectedcertification = null;
  }
}

  renderError() {
    this.container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #666;">
        <p>Erro ao carregar as experiências. Verifique se o arquivo JSON está disponível.</p>
        <button onclick="certificationManager.init()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #00BDD2; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Tentar Novamente
        </button>
      </div>
    `;
  }
}

let certificationManager;

document.addEventListener('DOMContentLoaded', () => {
  certificationManager = new CertificationManager();
});

document.addEventListener('click', (event) => {
  if (certificationManager && certificationManager.selectedcertification) {
    const certificationContainer = document.getElementById('certification-container');
    if (certificationContainer && !certificationContainer.contains(event.target)) {
      certificationManager.closecertification();
    }
  }
});

window.certificationManager = certificationManager;
