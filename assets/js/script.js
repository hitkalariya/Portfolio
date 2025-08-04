(function ($) {
	"use strict";

	// Preloader
	$(window).on('load', function() {
		$('#preloader').fadeOut(500);
	});

	// Back to top button
	$(window).scroll(function() {
		if ($(this).scrollTop() > 300) {
			$('#back-to-top').addClass('show');
		} else {
			$('#back-to-top').removeClass('show');
		}
	});

	$('#back-to-top').click(function() {
		$('html, body').animate({scrollTop: 0}, 800);
		return false;
	});

	// Skill bar animation
	function animateSkillBars() {
		$('.skill-progress').each(function() {
			const percentage = $(this).data('percentage');
			$(this).css('width', percentage + '%');
		});
	}

	// Skills scrollable container functionality
	function initializeSkillsScroll() {
		const skillsContainer = $('.skills-scrollable-container');
		const scrollIndicator = $('.scroll-indicator');
		
		if (skillsContainer.length) {
			// Hide scroll indicator if content doesn't overflow
			function checkScrollVisibility() {
				const container = skillsContainer[0];
				if (container.scrollHeight <= container.clientHeight) {
					scrollIndicator.hide();
				} else {
					scrollIndicator.show();
				}
			}
			
			// Check immediately, after a delay, on load and resize
			checkScrollVisibility();
			setTimeout(checkScrollVisibility, 100);
			setTimeout(checkScrollVisibility, 500);
			$(window).on('resize', checkScrollVisibility);
			$(window).on('load', checkScrollVisibility);
			
			// Smooth scroll to bottom when clicking scroll indicator
			scrollIndicator.on('click', function() {
				skillsContainer.animate({
					scrollTop: skillsContainer[0].scrollHeight
				}, 800);
			});
			
			// Hide scroll indicator when scrolled to bottom
			skillsContainer.on('scroll', function() {
				const container = this;
				const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 10;
				
				if (isAtBottom) {
					scrollIndicator.fadeOut(300);
				} else {
					scrollIndicator.fadeIn(300);
				}
			});
		}
	}

	// Recent Projects functionality
	function initializeRecentProjects() {
		if (typeof getTopProjects === 'function') {
			const topProjects = getTopProjects(3);
			const projectsContainer = $('.projects-main .parent-container');
			
			if (projectsContainer.length && topProjects.length > 0) {
				// Clear existing projects
				projectsContainer.empty();
				
				// Create a better layout structure
				const projectsHtml = `
					<div class="col-lg-12">
						<div class="recent-projects-grid">
							${topProjects.map((project, index) => `
								<div class="project-item-wrapper" data-project-id="${project.id}">
									<div class="project-item" style="cursor: pointer;">
										<div class="image">
											<img src="${project.image}" alt="${project.title}" class="img-fluid w-100">
											<div class="project-overlay">
												<div class="project-info">
													<h5 class="project-title">${project.title}</h5>
													<span class="project-category">${project.category}</span>
												</div>
												<div class="project-action">
													<i class="fab fa-github"></i>
												</div>
											</div>
											<div class="info">
												<span class="category">${project.category}</span>
											</div>
										</div>
									</div>
							`).join('')}
						</div>
						<div class="projects-description mt-3">
							<p class="description-text">
								Here, you'll find a showcase of my work in data science, machine learning, and artificial intelligence. 
								Each project represents my journey of learning, problem-solving, and innovation across diverse domains 
								such as cybersecurity, customer analytics, automotive insights, and more. Each project demonstrates 
								measurable impact and real-world applications.
							</p>
						</div>
					</div>
				`;
				
				projectsContainer.html(projectsHtml);
				
				// Add click handlers for project navigation to GitHub
				$('.project-item-wrapper[data-project-id]').on('click', function(e) {
					const projectId = $(this).data('project-id');
					const project = topProjects.find(p => p.id === projectId);
					if (project && project.githubUrl) {
						window.open(project.githubUrl, '_blank');
					}
				});
				
				// Add hover effects
				$('.project-item-wrapper').hover(
					function() {
						$(this).find('.project-item').css('transform', 'translateY(-8px)');
						$(this).find('.image img').css('transform', 'scale(1.1)');
						$(this).find('.project-overlay').css('opacity', '1');
					},
					function() {
						$(this).find('.project-item').css('transform', 'translateY(0)');
						$(this).find('.image img').css('transform', 'scale(1)');
						$(this).find('.project-overlay').css('opacity', '0');
					}
				);
			}
		}
	}

	// Intersection Observer for animations
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				
				// Animate skill bars when skills section is visible
				if (entry.target.classList.contains('expertise-card')) {
					setTimeout(animateSkillBars, 500);
				}
			}
		});
	}, observerOptions);

	// Observe elements for animation
	$(document).ready(function() {
		$('.card, .project-card').addClass('fade-in');
		$('.fade-in').each(function() {
			observer.observe(this);
		});
		
		// Initialize skills scroll functionality
		initializeSkillsScroll();
	});

	// Counter animation for achievement stats
	function animateCounters() {
		$('.stat-item h4').each(function() {
			const $this = $(this);
			const countTo = $this.text().replace(/[^0-9]/g, '');
			const suffix = $this.text().replace(/[0-9]/g, '');
			
			$({ countNum: 0 }).animate({
				countNum: countTo
			}, {
				duration: 2000,
				easing: 'swing',
				step: function() {
					$this.text(Math.floor(this.countNum) + suffix);
				},
				complete: function() {
					$this.text(countTo + suffix);
				}
			});
		});
	}

	// Trigger counter animation when stats section is visible
	const statsObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				animateCounters();
				statsObserver.unobserve(entry.target);
			}
		});
	});

	$(document).ready(function() {
		const statsElement = document.querySelector('.achievement-stats');
		if (statsElement) {
			statsObserver.observe(statsElement);
		}
	});

	// Theme color control js
	$(document).ready(function () {
		const isDarkMode = localStorage.getItem('darkMode') === 'true';
		$('body').toggleClass('dark-theme', isDarkMode);
		
		// Initialize skills scroll functionality
		initializeSkillsScroll();
		
		// Initialize recent projects
		initializeRecentProjects();

		$('#page-content').fadeIn(0);

		$('.theme-control-btn').on("click", function () {
			$('body').toggleClass('dark-theme');

			const isDark = $('body').hasClass('dark-theme');
			localStorage.setItem('darkMode', isDark);
		});
	});

	// Smooth scrolling for anchor links
	$('a[href^="#"]').on('click', function(e) {
		e.preventDefault();
		const target = $(this.getAttribute('href'));
		if (target.length) {
			$('html, body').animate({
				scrollTop: target.offset().top - 100
			}, 800);
		}
	});

	// Enhanced hover effects for project cards
	$('.project-item, .service-item').hover(
		function() {
			$(this).addClass('hover-effect');
		},
		function() {
			$(this).removeClass('hover-effect');
		}
	);

	// Mobile menu control js
	$(".mobile-menu-control-bar").on("click", function () {
		$(".mobile-menu-overlay").addClass("show");
		$(".navbar-main").addClass("show");
	})
	$(".mobile-menu-overlay").on("click", function () {
		$(".mobile-menu-overlay").removeClass("show");
		$(".navbar-main").removeClass("show");
	})

	// Parallax scroll effect js
	document.querySelectorAll(".move-with-cursor").forEach(a => {
		document.addEventListener("mousemove", function (e) {
			var t = e.clientX,
				e = e.clientY;
			a.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)", a.style.transform = `translate(${.01 * t}px, ${.01 * e}px) rotate(${.01 * (t + e)}deg)`
		})
	}),

		// Email copy button js
		new ClipboardJS('.btn-copy');

	// Email copy button tooltip js
	$(document).ready(function () {
		$(".btn-copy").on("click", function () {
			$(this).addClass("active");

			setTimeout(() => {
				$(this).removeClass("active");
			}, 1000);
		});
	});

	// Magnific popup js
	$(".parent-container").magnificPopup({
		delegate: ".gallery-popup",
		type: "image",
		gallery: {
			enabled: true,
		},
	});

	// Client feedback slider js
	$(".client-feedback-slider").slick({
		slidesToShow: 2,
		slidesToScroll: 1,
		autoplay: false,
		dots: false,
		infinite: true,
		arrows: true,
		speed: 500,
		prevArrow: '<i class="fas left icon fa-arrow-left"></i>',
		nextArrow: '<i class="fas right icon fa-arrow-right"></i>',
		responsive: [{
			breakpoint: 768,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
			}
		},]
	});

	// Article publications slider js
	$(".article-publications-slider").slick({
		slidesToShow: 2,
		slidesToScroll: 1,
		autoplay: false,
		dots: false,
		infinite: true,
		arrows: true,
		speed: 500,
		prevArrow: '<i class="fas left icon fa-arrow-left"></i>',
		nextArrow: '<i class="fas right icon fa-arrow-right"></i>',
		responsive: [{
			breakpoint: 768,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
			}
		},]
	});

	// Portfolio Pagination JavaScript
	$(document).ready(function() {
		// Initialize pagination variables
		let currentPage = 1;
		const projectsPerPage = 3;
		const totalProjects = $('.portfolio-page').length;
		const totalPages = Math.ceil(totalProjects / projectsPerPage);

		// Initialize pagination on page load
		initializePagination();

		// Function to initialize pagination
		function initializePagination() {
			// Show first page by default
			showPage(1);
			updatePaginationControls();
			updatePageInfo();
		}

		// Function to show specific page
		function showPage(pageNumber) {
			// Hide all portfolio pages with fade effect
			$('.portfolio-page').addClass('fade-out');
			
			setTimeout(() => {
				// Hide all pages
				$('.portfolio-page').hide();
				
				// Show only the current page
				$('.portfolio-page[data-page="' + pageNumber + '"]').show();
				
				// Remove fade-out class and add fade-in
				$('.portfolio-page[data-page="' + pageNumber + '"]').removeClass('fade-out').addClass('fade-in');
				
				// Update current page
				currentPage = pageNumber;
				
				// Update pagination controls
				updatePaginationControls();
				updatePageInfo();
			}, 300);
		}

		// Function to update pagination controls
		function updatePaginationControls() {
			// Remove active class from all page numbers
			$('.pagination-number').removeClass('active');
			
			// Add active class to current page number
			$('.pagination-number[onclick="goToPage(' + currentPage + ')"]').addClass('active');
			
			// Update previous/next button states
			$('#prev-btn').prop('disabled', currentPage === 1);
			$('#next-btn').prop('disabled', currentPage === totalPages);
			
			// Add/remove disabled class for styling
			if (currentPage === 1) {
				$('#prev-btn').addClass('disabled');
			} else {
				$('#prev-btn').removeClass('disabled');
			}
			
			if (currentPage === totalPages) {
				$('#next-btn').addClass('disabled');
			} else {
				$('#next-btn').removeClass('disabled');
			}
		}

		// Function to update page info text
		function updatePageInfo() {
			const startProject = (currentPage - 1) * projectsPerPage + 1;
			const endProject = Math.min(currentPage * projectsPerPage, totalProjects);
			
			$('#current-page-info').text(startProject + '-' + endProject);
			$('#total-projects').text(totalProjects);
		}

		// Function to change page (for previous/next buttons)
		window.changePage = function(direction) {
			const newPage = currentPage + direction;
			
			if (newPage >= 1 && newPage <= totalPages) {
				showPage(newPage);
			}
		};

		// Function to go to specific page (for page number buttons)
		window.goToPage = function(pageNumber) {
			if (pageNumber >= 1 && pageNumber <= totalPages) {
				showPage(pageNumber);
			}
		};

		// Add keyboard navigation support
		$(document).keydown(function(e) {
			// Only handle keyboard navigation if we're on the portfolio page
			if (window.location.pathname.includes('portfolio.html')) {
				if (e.keyCode === 37) { // Left arrow
					e.preventDefault();
					changePage(-1);
				} else if (e.keyCode === 39) { // Right arrow
					e.preventDefault();
					changePage(1);
				}
			}
		});

		// Add smooth scrolling to top when changing pages (for better UX)
		function scrollToTop() {
			$('html, body').animate({
				scrollTop: $('.portfolio-area').offset().top - 100
			}, 500);
		}

		// Override the changePage and goToPage functions to include scrolling
		const originalChangePage = window.changePage;
		const originalGoToPage = window.goToPage;

		window.changePage = function(direction) {
			originalChangePage(direction);
			scrollToTop();
		};

		window.goToPage = function(pageNumber) {
			originalGoToPage(pageNumber);
			scrollToTop();
		};
	});

	// Add loading state to buttons
	$('.btn-call, .btn-hire-me').on('click', function() {
		const $btn = $(this);
		const originalText = $btn.text();
		$btn.text('Loading...').prop('disabled', true);
		setTimeout(() => {
			$btn.text(originalText).prop('disabled', false);
		}, 2000);
	});

})(jQuery);