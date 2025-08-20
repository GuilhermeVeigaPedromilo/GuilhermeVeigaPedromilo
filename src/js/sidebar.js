// Elementos DOM
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');

// Função para abrir sidebar
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('show');
  menuToggle.classList.add('active');
}

// Função para fechar sidebar
function closeSidebarFn() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
  menuToggle.classList.remove('active');
}

// Função para alternar sidebar (abrir/fechar)
function toggleSidebar() {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
  menuToggle.classList.toggle('active');
}

// Event Listeners do Sidebar
menuToggle.addEventListener('click', toggleSidebar);
closeSidebar.addEventListener('click', closeSidebarFn);
overlay.addEventListener('click', closeSidebarFn);

// Fechar sidebar ao clicar em qualquer link do sidebar
document.querySelectorAll('#sidebar a').forEach(link => {
  link.addEventListener('click', closeSidebarFn);
});

// Fechar sidebar com a tecla ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeSidebarFn();
  }
});