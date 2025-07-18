// ✅ 최종 통합 script.js 파일 (v3.1 - 핵심 버튼 복원 및 기능 시너지 강화)

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. 모바일 메뉴 기능 (기존과 동일) ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => mainNav.classList.toggle('active'));
    }

    // --- 2. 건강검진 대상자 확인 기능 (고도화된 최종 로직) ---
    const yearInput = document.getElementById('birth-year-input');
    const checkButton = document.getElementById('check-button');
    
    const resultSection = document.getElementById('result-section');
    const resultMessage = document.getElementById('result-message');
    const resultSubtitle = document.getElementById('result-subtitle');
    const checklistContainer = document.getElementById('checklist-container');
    const resultButtons = document.getElementById('result-buttons');

    // 연령대별 검진 항목 및 서브페이지 정보 데이터
    const checkupData = {
        '20-30': {
            page: 'sub-page.html',
            buttonText: '▶ 20·30대 검진 항목 전체보기',
            items: [
                { name: '일반 건강검진', link: 'sub-page.html#target' },
                { name: '자궁경부암 검진 (여성)', link: 'sub-page.html#cervical-cancer' }
            ]
        },
        '40-50': {
            page: 'sub-page-40s.html',
            buttonText: '▶ 40·50대 검진 항목 전체보기',
            items: [
                { name: '위암 검진', link: 'sub-page-40s.html#stomach-cancer' },
                { name: '대장암 검진 (50세+)', link: 'sub-page-40s.html#colon-cancer' },
                { name: '유방암 검진 (여성)', link: 'sub-page-40s.html#breast-cancer' },
                { name: '간암 검진 (고위험군)', link: 'sub-page-40s.html#liver-cancer' }
            ]
        },
        '60+': {
            page: 'sub-page-60s.html', // 나중에 이 파일을 만드셔야 합니다.
            buttonText: '▶ 60대+ 검진 항목 전체보기',
            items: [
                { name: '주요 암검진', link: 'sub-page-60s.html#cancer' },
                { name: '골밀도 검사 (만 66세 여성)', link: 'sub-page-60s.html#bone' },
                { name: '인지기능장애 검사', link: 'sub-page-60s.html#cognitive' }
            ]
        }
    };

    if (yearInput && checkButton && resultSection) {
        yearInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') checkButton.click();
        });
        
        checkButton.addEventListener('click', function() {
            // 이전 결과 초기화
            resultSection.classList.add('hidden');
            resultMessage.innerHTML = '';
            resultSubtitle.textContent = '';
            checklistContainer.innerHTML = '';
            resultButtons.innerHTML = '';

            const birthYear = parseInt(yearInput.value);

            if (isNaN(birthYear) || yearInput.value.length !== 4 || birthYear < 1900 || birthYear > new Date().getFullYear()) {
                alert('유효한 출생연도 4자리를 입력해주세요. (예: 1985)');
                yearInput.focus();
                return;
            }

            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;
            const isEligible = (currentYear % 2 === birthYear % 2);

            if (isEligible) {
                resultMessage.innerHTML = `고객님(<strong>${age}세</strong>)은 <strong>${currentYear}년 국가건강검진 대상자</strong>입니다.`;
                
                let ageGroupKey;
                if (age >= 60) ageGroupKey = '60+';
                else if (age >= 40) ageGroupKey = '40-50';
                else if (age >= 20) ageGroupKey = '20-30';
                
                const ageGroupData = checkupData[ageGroupKey];

                if (ageGroupData) {
                    resultSubtitle.textContent = '아래는 올해 받아야 할 주요 검진 항목입니다.';
                    
                    // 1. 개인화된 체크리스트 생성
                    const checklist = document.createElement('ul');
                    checklist.className = 'result-checklist';
                    ageGroupData.items.forEach(item => {
                        const listItem = document.createElement('li');
                        const link = document.createElement('a');
                        link.href = item.link;
                        link.textContent = item.name;
                        listItem.appendChild(link);
                        checklist.appendChild(listItem);
                    });
                    checklistContainer.appendChild(checklist);

                    // ✅ [복원 및 개선] 핵심 CTA 버튼 생성
                    const mainButton = createButton(ageGroupData.buttonText, ageGroupData.page, 'primary');
                    resultButtons.appendChild(mainButton);
                } else {
                     resultSubtitle.textContent = '만 20세 미만은 영유아/학생 건강검진 대상입니다.';
                }

            } else { // 대상자가 아닌 경우
                const nextYear = currentYear + 1;
                resultMessage.innerHTML = `고객님(<strong>${age}세</strong>)은 올해 검진 대상이 아니며, <strong>${nextYear}년에 대상</strong>입니다.`;
                
                if (age >= 20) {
                    resultSubtitle.textContent = `건강이 염려되신다면 국가검진 외 종합검진을 고려해볼 수 있습니다.`;
                    // ✅ [복원] 비대상자를 위한 CTA 버튼
                    const button = createButton('종합검진과 차이점 알아보기', '#', 'secondary'); // 종합검진 관련 페이지 링크
                    resultButtons.appendChild(button);
                }
            }
            
            resultSection.classList.remove('hidden');
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
