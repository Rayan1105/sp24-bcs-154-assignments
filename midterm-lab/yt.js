console.log("FINALLY BHAI YEH KAAM KARRAHA");

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    console.log("Menu is now active:", navMenu.classList.contains('active'));
});

const navLinks = document.querySelectorAll('.right-section a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});
// featured videos sectionn
$(document).ready(function () {
    $.ajax({
        url: 'https://fakestoreapi.com/products?limit=4',
        method: 'GET',
        success: function (products) {
            const featuredGrid = $('#featured-grid');
            featuredGrid.empty();

            products.forEach((product, index) => {
                const durations = ['12:45', '08:10', '15:22', '22:05'];
                const channelPics = [
                    "channel-pictures/channel-1.jpeg",
                    "channel-pictures/channel-2.jpeg",
                    "channel-pictures/channel-5.jpeg",
                    "channel-pictures/channel-4.jpeg"
                ];
                const viewsData = [
                    "2.3M views · 2 weeks ago",
                    "1.8M views · 1 month ago",
                    "4.1M views · 5 days ago",
                    "987K views · 3 weeks ago"
                ];

                const cardHTML = `
                    <div class="video-preview">
                        <div class="thumbnail-row">
                            <img class="thumbnail" src="${product.image}">
                            <div class="video-time">${durations[index]}</div>
                        </div>
                        <div class="video-info-grid">
                            <div class="channel-picture">
                                <img class="profile-picture" src="${channelPics[index]}">
                            </div>
                            <div class="video-info">
                                <p class="video-title">${product.title}</p>
                                <p class="video-author">Featured Creator</p>
                                <p class="video-stats">${product.rating.rate} ★ · ${product.rating.count} ratings</p>
                                <p class="video-stats" style="margin-top: 2px;">${viewsData[index]}</p>
                                <div style="margin-top: 14px; margin-bottom: 10px;">
                                    <button class="quick-view-btn" 
                                            data-id="${product.id}"
                                            style="padding: 7px 16px; background: #f00; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; width: 100%;">
                                        Quick View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>`;

                featuredGrid.append(cardHTML);
            });

            $('.quick-view-btn').on('click', function () {
                const id = $(this).data('id');
                const product = products.find(p => p.id === id);
                if (product) {
                    $('#modalImage').attr('src', product.image);
                    $('#modalTitle').text(product.title);
                    $('#modalRating').html(`Rating: ${product.rating.rate} ★ (${product.rating.count} reviews)`);
                    $('#modalDescription').text(product.description);
                    $('#quickViewModal').css('display', 'flex');
                }
            });
        },
        error: function () {
            console.error('Failed to load Featured Videos from API');
            $('#featured-grid').html('<p style="color:red; padding:20px;">Could not load featured videos. Please check your internet.</p>');
        }
    });

    $('#modalClose').on('click', function () {
        $('#quickViewModal').css('display', 'none');
    });

    $('#quickViewModal').on('click', function (e) {
        if (e.target.id === 'quickViewModal') {
            $('#quickViewModal').css('display', 'none');
        }
    });
});
