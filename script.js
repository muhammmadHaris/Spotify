// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Theme toggle functionality
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = themeToggle.querySelector("i");

  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("light-theme");

    if (document.body.classList.contains("light-theme")) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
  });

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", function () {
    navLinks.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  const navItems = document.querySelectorAll(".nav-links a");
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      navLinks.classList.remove("active");
    });
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Scroll animations
  function checkScroll() {
    const elements = document.querySelectorAll(".fade-in, .zoom-in");

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (elementPosition < screenPosition) {
        element.style.animationPlayState = "running";
      }
    });

    // Show/hide scroll to top button
    const scrollToTopBtn = document.querySelector(".scroll-to-top");
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", checkScroll);
  // Initial check in case elements are already in view
  checkScroll();

  // Scroll to top functionality
  const scrollToTopBtn = document.createElement("div");
  scrollToTopBtn.className = "scroll-to-top";
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(scrollToTopBtn);

  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Music player simulation
  const playButtons = document.querySelectorAll(".play-button");
  playButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();

      const card = this.closest(".music-card");
      const songName = card.querySelector("h3").textContent;
      const artist = card.querySelector("p").textContent;

      // Toggle play/pause icon
      const icon = this.querySelector("i");
      if (icon.classList.contains("fa-play")) {
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
        console.log(`Now playing: ${songName} by ${artist}`);
      } else {
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
        console.log(`Paused: ${songName} by ${artist}`);
      }
    });
  });

  // Initialize music slider
  initMusicSlider();

  // Add intersection observer for more advanced animations
  if ("IntersectionObserver" in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in, .zoom-in").forEach((item) => {
      observer.observe(item);
    });
  }
});

// Music slider functionality
function initMusicSlider() {
  const sliderContainer = document.createElement("div");
  sliderContainer.className = "slider-container";

  const musicGrid = document.querySelector(".music-grid");
  const musicCards = Array.from(musicGrid.querySelectorAll(".music-card"));

  // Only create slider if we're on mobile
  if (window.innerWidth <= 768) {
    // Hide original grid and create slider
    musicGrid.style.display = "none";

    const sliderSection = document.createElement("div");
    sliderSection.className = "music-slider";

    // Create slider items
    musicCards.forEach((card) => {
      const sliderItem = document.createElement("div");
      sliderItem.className = "slider-item";
      sliderItem.appendChild(card.cloneNode(true));
      sliderContainer.appendChild(sliderItem);
    });

    sliderSection.appendChild(sliderContainer);

    // Create navigation dots
    const sliderNav = document.createElement("div");
    sliderNav.className = "slider-nav";

    musicCards.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.className = "slider-dot";
      if (index === 0) dot.classList.add("active");
      dot.dataset.index = index;
      sliderNav.appendChild(dot);
    });

    sliderSection.appendChild(sliderNav);

    // Create arrows
    const sliderArrows = document.createElement("div");
    sliderArrows.className = "slider-arrows";

    const leftArrow = document.createElement("div");
    leftArrow.className = "slider-arrow slider-arrow-left";
    leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';

    const rightArrow = document.createElement("div");
    rightArrow.className = "slider-arrow slider-arrow-right";
    rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';

    sliderArrows.appendChild(leftArrow);
    sliderArrows.appendChild(rightArrow);

    sliderSection.appendChild(sliderArrows);

    // Insert slider after the section title
    const musicSection = document.querySelector(".music .container");
    const sectionTitle = musicSection.querySelector(".section-title");
    musicSection.insertBefore(sliderSection, sectionTitle.nextSibling);

    // Slider functionality
    let currentSlide = 0;
    const slides = sliderContainer.querySelectorAll(".slider-item");
    const dots = sliderNav.querySelectorAll(".slider-dot");

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      sliderContainer.style.transform = `translateX(-${index * 100}%)`;

      // Update active dot
      dots.forEach((dot) => dot.classList.remove("active"));
      dots[index].classList.add("active");

      currentSlide = index;
    }

    // Arrow click events
    leftArrow.addEventListener("click", () => goToSlide(currentSlide - 1));
    rightArrow.addEventListener("click", () => goToSlide(currentSlide + 1));

    // Dot click events
    dots.forEach((dot) => {
      dot.addEventListener("click", function () {
        goToSlide(parseInt(this.dataset.index));
      });
    });

    // Swipe functionality for touch devices
    let touchStartX = 0;
    let touchEndX = 0;

    sliderSection.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    sliderSection.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      if (touchEndX < touchStartX) goToSlide(currentSlide + 1);
      if (touchEndX > touchStartX) goToSlide(currentSlide - 1);
    }

    // Auto slide (optional)
    let slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);

    // Pause auto slide on hover
    sliderSection.addEventListener("mouseenter", () =>
      clearInterval(slideInterval)
    );
    sliderSection.addEventListener("mouseleave", () => {
      slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
    });
  }
}

// Handle window resize to toggle between grid and slider
window.addEventListener("resize", function () {
  const musicGrid = document.querySelector(".music-grid");
  const musicSlider = document.querySelector(".music-slider");

  if (window.innerWidth > 768 && musicSlider) {
    musicSlider.remove();
    musicGrid.style.display = "grid";
  } else if (
    window.innerWidth <= 768 &&
    !musicSlider &&
    musicGrid.style.display !== "none"
  ) {
    initMusicSlider();
  }
});
