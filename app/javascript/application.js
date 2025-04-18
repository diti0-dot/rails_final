// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
//= require rails-ujs
//= require turbolinks
//= require_tree .
//= require draw
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.querySelector('.dashboard-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (toggle) {
 
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    
  
    if (isCollapsed) {
      toggle.textContent = "D";
      sidebar.classList.add('collapsed');
    } else {
      toggle.textContent = "Dashboard";
    }
    
    toggle.addEventListener('click', function() {
      const willCollapse = !sidebar.classList.contains('collapsed');
    
      sidebar.classList.toggle('collapsed');
      
     
      toggle.textContent = willCollapse ? "D" : "Dashboard";
      
    
      localStorage.setItem('sidebarCollapsed', willCollapse);
    });
  }
});
