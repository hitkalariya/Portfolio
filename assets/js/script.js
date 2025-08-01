(function ($) {
	"use strict";

	// Theme color control js
	$(document).ready(function () {
		const isDarkMode = localStorage.getItem('darkMode') === 'true';
		$('body').toggleClass('dark-theme', isDarkMode);

		$('#page-content').fadeIn(0);

		$('.theme-control-btn').on("click", function () {
			$('body').toggleClass('dark-theme');

			const isDark = $('body').hasClass('dark-theme');
			localStorage.setItem('darkMode', isDark);
		});
	});

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

})(jQuery);
