// Loader timeout - will hide after 2.5 seconds
window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('mainContent').classList.remove('hidden');
            
            // Add animation class to hero
            document.querySelector('.hero h1').style.animation = 'fadeInUp 1s ease';
            document.querySelector('.hero p').style.animation = 'fadeInUp 1s ease 0.3s forwards';
            document.querySelector('.scroll-down').style.animation = 'fadeIn 1s ease 0.6s forwards';
        }, 500);
    }, 2500);
});

// Form submission
document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.querySelector('span').classList.add('hidden');
    submitBtn.querySelector('.submit-loader').classList.remove('hidden');
    
    // Simulate processing delay
    setTimeout(function() {
        // Get form values
        const application = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            channel: document.getElementById('channel').value,
            social: document.getElementById('social').value,
            niche: document.getElementById('niche').value,
            availability: document.getElementById('availability').value,
            date: new Date().toISOString(),
            status: 'Pending'
        };
        
        // Save to localStorage (in a real app, you'd send to a server)
        saveApplication(application);
        
        // Hide form and show confirmation
        document.querySelector('.form-container').classList.add('hidden');
        document.getElementById('confirmation').classList.add('show');
    }, 2000);
});

function saveApplication(application) {
    // Get existing applications or create empty array
    let applications = JSON.parse(localStorage.getItem('legendTechApplications')) || [];
    
    // Add new application
    applications.push(application);
    
    // Save back to localStorage
    localStorage.setItem('legendTechApplications', JSON.stringify(applications));
    
    console.log('Application saved:', application);
}

// Scroll down arrow click
document.querySelector('.scroll-down').addEventListener('click', function() {
    document.querySelector('.form-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    .hero h1, .hero p, .scroll-down {
        opacity: 0;
    }
`;
document.head.appendChild(style);