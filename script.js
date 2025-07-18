// ✅ 최종 통합 script.js 파일 (v3.0 - 개인화된 체크리스트 생성)

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. 모바일 메뉴 기능 (기존과 동일) ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => mainNav.classList.toggle('active'));
    }

    // --- 2. 건강검진 대상자 확인 기능 (고도화된 로직) ---
    const yearInput = document.getElementById('birth-year-input');
    const checkButton = document.getElementById('check-button');
    
    // 결과 표시를 위한 요소들
    const resultSection = document.getElementById('result-section');
    const resultMessage = document.getElementById('result-message');
    const resultSubtitle = document.getElementById('result-subtitle');
    const checklistContainer = document.getElementById('checklist-container');
    const resultButtons = document.getElementById('result-buttons');

    // ✅ [신규] 연령대별 검진 항목 데이터. 여기서 모든 것을 관리합니다.
    // 추후 sub-page-40s.html, sub-page-60s.html 등을 만들고 링크를 수정하세요.
    const checkupData = {
        '20-30': [
            { name: '일반 건강검진', link: 'sub-page.html#target' },
            { name: '자궁경부암 검진 (여성)', link: 'sub-page.html#cervical-cancer' }
        ],
        '40-50': [
            { name: '일반 건강검진', link: 'sub-page-40s.html#general' },
            { name: '위암 검진 (위내시경)', link: 'sub-page-40s.html#stomach-cancer' },
            { name: '대장암 검진 (50세+)', link: 'sub-page-40s.html#colon-cancer' },
            { name: '유방암 검진 (여성)', link: 'sub-page-40s.html#breast-cancer' },
            { name: '간암 검진 (고위험군)', link: 'sub-page-40s.html#liver-cancer' }
        ],
        '60+': [
            { name: '일반 건강검진', link: 'sub-page-60s.html#general' },
            { name: '위암/대장암/유방암/자궁경부암', link: 'sub-page-60s.html#cancer' },
            { name: '골밀도 검사 (만 66세 여성)', link: 'sub-page-60s.html#bone' },
            { name: '인지기능장애 검사 (만 66세+)', link: 'sub-page-60s.html#cognitive' }
        ]
    };

    if (yearInput && checkButton && resultSection) {
        // 엔터 키로도 조회 가능하도록
        yearInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                checkButton.click();
            }
        });
        
        checkButton.addEventListener('click', function() {
            // 이전 결과 초기화
            resultSection.classList.add('hidden');
            resultMessage.innerHTML = '';
            resultSubtitle.textContent = '';
            checklistContainer.innerHTML = '';
            resultButtons.innerHTML = '';

            const birthYear = parseInt(yearInput.value);

            // 유효성 검사
            if (isNaN(birthYear) || yearInput.value.length !== 4 || birthYear < 1900 || birthYear > new Date().getFullYear()) {
                alert('유효한 출생연도 4자리를 입력해주세요. (예: 1985)');
                yearInput.focus();
                return;
            }

            // ✅ [핵심 개선] 대상자 판단 및 개인화된 결과 생성 로직
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;
            const isEligible = (currentYear % 2 === birthYear % 2);

            if (isEligible) {
                resultMessage.innerHTML = `고객님(<strong>${age}세</strong>)은 <strong>${currentYear}년 국가건강검진 대상자</strong>입니다.`;
                resultSubtitle.textContent = '아래는 올해 받아야 할 주요 검진 항목입니다.';

                let ageGroup;
                if (age >= 60) ageGroup = '60+';
                else if (age >= 40) ageGroup = '40-50';
                else if (age >= 20) ageGroup = '20-30';

                if (ageGroup && checkupData[ageGroup]) {
                    const checklist = document.createElement('ul');
                    checklist.className = 'result-checklist';
                    
                    checkupData[ageGroup].forEach(item => {
                        const listItem = document.createElement('li');
                        const link = document.createElement('a');
                        link.href = item.link; // 데이터에 정의된 링크 사용
                        link.textContent = item.name;
                        listItem.appendChild(link);
                        checklist.appendChild(listItem);
                    });
                    checklistContainer.appendChild(checklist);
                } else {
                     resultSubtitle.textContent = '만 20세 미만은 영유아/학생 건강검진 대상입니다.';
                }

            } else {
                const nextYear = currentYear + 1;
                resultMessage.innerHTML = `고객님(<strong>${age}세</strong>)은 올해 검진 대상이 아니며, <strong>${nextYear}년에 대상</strong>입니다.`;
                
                if (age >= 20) {
                    resultSubtitle.textContent = `건강이 염려되신다면 국가검진 외 종합검진을 고려해볼 수 있습니다.`;
                    const button = createButton('종합검진과 차이점 알아보기', '#', 'primary');
                    resultButtons.appendChild(button);
                }
            }
            
            // 결과 섹션 표시
            resultSection.classList.remove('hidden');
             // 결과 섹션으로 부드럽게 스크롤
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // 버튼 생성을 위한 헬퍼 함수
    function createButton(text, href, typeClass) {
        const button = document.createElement('a');
        button.href = href;
        button.className = `result-btn ${typeClass}`;
        button.textContent = text;
        return button;
    }
});
