document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navigation Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('header-scrolled');
        } else {
            navbar.classList.remove('header-scrolled');
        }
    });

    // 2. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100, // Offset for sticky header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 3. Simple Animation for Schedule Items (Staggered Fade In)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.feature-card, .schedule-item');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(el);
    });


    // 4. Data Synchronization from Dashboard (LocalStorage)
    const syncLandingPageData = () => {
        const gedungData = JSON.parse(localStorage.getItem('gedungData') || '[]');
        const bookingData = JSON.parse(localStorage.getItem('bookingData') || '[]');

        // Update Stats in Hero
        const statGedung = document.getElementById('statGedung');
        if (statGedung) {
            statGedung.textContent = (gedungData.length || 15) + '+';
        }

        // Render Fasilitas/Gedung Grid
        const fasilitasGrid = document.getElementById('fasilitasGrid');
        if (fasilitasGrid && gedungData.length > 0) {
            fasilitasGrid.innerHTML = gedungData.map(g => `
                <div class="feature-card">
                    <div class="icon-box">
                        <i class="ph ph-buildings"></i>
                    </div>
                    <h3>${g.nama}</h3>
                    <p>Kapasitas: ${g.kapasitas} Orang</p>
                    <p style="font-size: 0.85rem; margin-top: 0.5rem;">${g.fasilitas}</p>
                    <a href="#kontak" class="btn btn-text" style="padding-left: 0; margin-top: 1rem; color: var(--primary);">
                        Detail & Booking <i class="ph ph-arrow-right"></i>
                    </a>
                </div>
            `).join('');
        } else if (fasilitasGrid) {
            // Default content if no data in localStorage
            fasilitasGrid.innerHTML = `
                <div class="feature-card">
                    <div class="icon-box"><i class="ph ph-calendar-check"></i></div>
                    <h3>Booking Real-Time</h3>
                    <p>Cek ketersediaan gedung dan lakukan reservasi langsung dari perangkat apa saja tanpa perlu ke biro.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-box"><i class="ph ph-buildings"></i></div>
                    <h3>Database Lengkap</h3>
                    <p>Informasi detail mengenai kapasitas, fasilitas, dan foto kondisi terkini setiap ruangan dan gedung.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-box"><i class="ph ph-chart-bar"></i></div>
                    <h3>Laporan & Statistik</h3>
                    <p>Dashboard analitik untuk memantau frekuensi penggunaan dan efektivitas pengelolaan aset kampus.</p>
                </div>
            `;
        }

        // Render Jadwal (Hero Card)
        const scheduleList = document.getElementById('scheduleList');
        if (scheduleList) {
            const confirmedBookings = bookingData.filter(b => b.status === 'Confirmed' || b.status === 'Pending').slice(0, 3);
            if (confirmedBookings.length > 0) {
                scheduleList.innerHTML = confirmedBookings.map(b => `
                    <div class="schedule-item">
                        <div class="time">Hari Ini</div>
                        <div class="event-details">
                            <h4>${b.pemohon}</h4>
                            <p>${b.gedung}</p>
                        </div>
                        <span class="tag ${b.status === 'Confirmed' ? 'busy' : 'upcoming'}">${b.status}</span>
                    </div>
                `).join('');
            } else {
                scheduleList.innerHTML = `
                    <div class="schedule-item">
                        <div class="time">08:00 - 12:00</div>
                        <div class="event-details">
                            <h4>Sidang Tertutup Senat</h4>
                            <p>Auditorium Ali Hasjmy</p>
                        </div>
                        <span class="tag busy">Sedang Berlangsung</span>
                    </div>
                `;
            }
        }

        // Update Date
        const dateEl = document.getElementById('currentDate');
        if (dateEl) {
            const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
            dateEl.textContent = new Date().toLocaleDateString('id-ID', options);
        }
    };
    syncLandingPageData();

    // 5. Testimonial Slider Logic
    const track = document.querySelector('.slider-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const slideWidth = slides[0].getBoundingClientRect().width;

        // Arrange slides next to one another
        slides.forEach((slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        });

        let currentSlideIndex = 0;

        const moveToSlide = (index) => {
            track.style.transform = 'translateX(-' + (index * 100) + '%)';
            currentSlideIndex = index;
        };

        nextButton.addEventListener('click', () => {
            if (currentSlideIndex < slides.length - 1) {
                moveToSlide(currentSlideIndex + 1);
            } else {
                moveToSlide(0); // Loop back to start
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentSlideIndex > 0) {
                moveToSlide(currentSlideIndex - 1);
            } else {
                moveToSlide(slides.length - 1); // Loop to last
            }
        });

        // Auto slide
        setInterval(() => {
            if (currentSlideIndex < slides.length - 1) {
                moveToSlide(currentSlideIndex + 1);
            } else {
                moveToSlide(0);
            }
        }, 5000);
    }
});
