// 院校库筛选逻辑（项目类型 / 专业方向联动 / 地区 / 学费 / 搜索）
(function () {
    'use strict';

    const schoolList = document.getElementById('schoolList');
    if (!schoolList) return; // 只在院校查询页执行

    const cards = Array.from(schoolList.querySelectorAll('.school-card'));
    const projectTypeChips = document.querySelectorAll('#filterProjectType .filter-chip');
    const majorChips = document.querySelectorAll('#filterMajor .filter-chip');
    const regionSelect = document.getElementById('filterRegion');
    const tuitionSelect = document.getElementById('filterTuition');
    const searchInput = document.getElementById('filterSearch');
    const filterCount = document.getElementById('filterCount');
    const schoolEmpty = document.getElementById('schoolEmpty');
    const resetBtn = document.getElementById('filterReset');
    const emptyResetBtn = document.getElementById('emptyReset');

    let state = {
        projectType: 'all',
        major: 'all',
        region: 'all',
        tuition: 'all',
        search: ''
    };

    // 专业方向与项目类型的联动关系（data-for 属性已标记，这里用于兜底）
    function updateMajorChips() {
        majorChips.forEach(chip => {
            const forType = chip.dataset.for || 'all';
            const visible = forType === 'all' || forType === state.projectType;
            chip.classList.toggle('hidden', !visible);
        });

        // 如果当前选中的专业方向在新项目类型下不可见，重置为"全部"
        const activeChip = document.querySelector('#filterMajor .filter-chip.active');
        if (activeChip && activeChip.classList.contains('hidden')) {
            setActiveChip(majorChips, 'all');
            state.major = 'all';
        }
    }

    function setActiveChip(chips, value) {
        chips.forEach(chip => {
            chip.classList.toggle('active', chip.dataset.value === value);
        });
    }

    function getActiveChipValue(chips) {
        const active = Array.from(chips).find(chip => chip.classList.contains('active'));
        return active ? active.dataset.value : 'all';
    }

    function tuitionMatches(card) {
        if (state.tuition === 'all') return true;
        const min = parseFloat(card.dataset.tuitionMin) || 0;
        const max = parseFloat(card.dataset.tuitionMax) || 999;
        const [low, high] = state.tuition.split('-').map(Number);
        // 区间有交集即匹配
        return max >= low && min <= high;
    }

    function matchesSearch(card) {
        if (!state.search) return true;
        const title = (card.dataset.title || '').toLowerCase();
        const summary = (card.querySelector('.school-card-summary')?.textContent || '').toLowerCase();
        return title.includes(state.search) || summary.includes(state.search);
    }

    function applyFilters() {
        let visibleCount = 0;

        cards.forEach(card => {
            const cardType = card.dataset.projectType || 'domestic';
            const cardMajor = card.dataset.major || 'all';
            const cardRegion = card.dataset.region || 'all';

            const typeMatch = state.projectType === 'all' || cardType === state.projectType;
            const majorMatch = state.major === 'all' || cardMajor === state.major;
            const regionMatch = state.region === 'all' || cardRegion === state.region;
            const tuitionMatch = tuitionMatches(card);
            const searchMatch = matchesSearch(card);

            const visible = typeMatch && majorMatch && regionMatch && tuitionMatch && searchMatch;
            card.style.display = visible ? '' : 'none';
            if (visible) visibleCount++;
        });

        filterCount.textContent = visibleCount;
        if (schoolEmpty) {
            schoolEmpty.hidden = visibleCount > 0;
        }
    }

    function resetFilters() {
        state = {
            projectType: 'all',
            major: 'all',
            region: 'all',
            tuition: 'all',
            search: ''
        };
        setActiveChip(projectTypeChips, 'all');
        setActiveChip(majorChips, 'all');
        updateMajorChips();
        regionSelect.value = 'all';
        tuitionSelect.value = 'all';
        searchInput.value = '';
        applyFilters();
    }

    projectTypeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            setActiveChip(projectTypeChips, chip.dataset.value);
            state.projectType = chip.dataset.value;
            updateMajorChips();
            applyFilters();
        });
    });

    majorChips.forEach(chip => {
        chip.addEventListener('click', () => {
            if (chip.classList.contains('hidden')) return;
            setActiveChip(majorChips, chip.dataset.value);
            state.major = chip.dataset.value;
            applyFilters();
        });
    });

    regionSelect.addEventListener('change', () => {
        state.region = regionSelect.value;
        applyFilters();
    });

    tuitionSelect.addEventListener('change', () => {
        state.tuition = tuitionSelect.value;
        applyFilters();
    });

    searchInput.addEventListener('input', () => {
        state.search = searchInput.value.trim().toLowerCase();
        applyFilters();
    });

    resetBtn?.addEventListener('click', resetFilters);
    emptyResetBtn?.addEventListener('click', resetFilters);

    // 初始化
    updateMajorChips();
    applyFilters();
})();
