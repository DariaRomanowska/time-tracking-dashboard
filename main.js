fetch('data.json')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        const timeBlocks = document.querySelectorAll('.el'); // Убедитесь, что элементы с классом .el существуют
        if (timeBlocks.length === 0) {
            console.error("No elements with class '.el' found.");
            return;
        }

        const dailyBtn = document.getElementById('daily');
        const weeklyBtn = document.getElementById('weekly');
        const monthlyBtn = document.getElementById('monthly');

        data.forEach((item, index) => {
            const el = timeBlocks[index];
            if (!el) return;

            const itemTitle = el.querySelector('.item-title-text');
            const itemHour = el.querySelector('.hour');
            const itemPrevious = el.querySelector('.previous-time');
            const itemImg = el.querySelector('.item-top');
            const itemImgBg = el.querySelector('.item-top-bg');
            const rootStyles = getComputedStyle(document.documentElement);

            const backgroundColor = rootStyles.getPropertyValue(`--${item.src}`);
            if (itemImgBg) itemImgBg.style.backgroundColor = backgroundColor || '#000'; // Используем черный как резерв

            if (itemImg) itemImg.src = `images/icon-${item.src}.svg`;

            if (itemTitle) itemTitle.textContent = item.title;

            const updateTimeframes = (period) => {
                if (!item.timeframes || !item.timeframes[period]) return;

                const { current, previous } = item.timeframes[period];
                if (itemHour) itemHour.textContent = `${current}hrs`;
                if (itemPrevious) {
                    const periodLabel =
                        period === 'daily' ? 'Yesterday' :
                            period === 'weekly' ? 'Last Week' :
                                'Last Month';
                    itemPrevious.textContent = `${periodLabel} - ${previous}hrs`;
                }
            };

            dailyBtn.addEventListener('click', () => {
                el.classList.add('daily');
                el.classList.remove('weekly', 'monthly');
                updateTimeframes('daily');
            });

            weeklyBtn.addEventListener('click', () => {
                el.classList.add('weekly');
                el.classList.remove('daily', 'monthly');
                updateTimeframes('weekly');
            });

            monthlyBtn.addEventListener('click', () => {
                el.classList.add('monthly');
                el.classList.remove('daily', 'weekly');
                updateTimeframes('monthly');
            });

            el.classList.add('daily');
            updateTimeframes('daily');
        });
    })
    .catch((error) => {
        console.error('Error fetching or processing data:', error);
    });
