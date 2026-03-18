$(document).ready(function () {
  // 헤더
  $("#headerWrapper").load("../views/includes/header.html", function () {
    const header = document.querySelector("#headerWrapper");
    if (!header) return;

    function handleScroll() {
      const isTop = window.scrollY === 0;
      header.classList.toggle("no-bg", isTop);
    }

    function updateListener() {
      const isWide = window.matchMedia("(min-width: 768px)").matches;

      if (isWide) {
        window.addEventListener("scroll", handleScroll);
        handleScroll();
      } else {
        window.removeEventListener("scroll", handleScroll);
        header.classList.remove("no-bg");
      }
    }

    updateListener();
    window.addEventListener("resize", updateListener);
  });

  // 토글 버튼
  const tabWrapper = document.querySelector(".toggle-tab");
  const tabs = tabWrapper.querySelectorAll("li");
  const indicator = tabWrapper.querySelector(".indicator");
  const mainBgLease = document.querySelector(".bg-img.lease");
  const mainBgFinancial = document.querySelector(".bg-img.financial");

  // 슬라이드 인디케이터
  const progressBar = document.querySelector(".progress-bar span");
  progressBar.style.width = "40%";

  function toggleTabs() {
    // 현재 active 된 탭 찾기
    const activeTab = tabWrapper.querySelector("li.active");
    let newTab;

    if (activeTab === tabs[0]) {
      newTab = tabs[1]; // 두 번째로 전환
    } else {
      newTab = tabs[0]; // 첫 번째로 전환
    }

    // active 클래스 교체
    tabs.forEach((tab) => tab.classList.remove("active"));
    newTab.classList.add("active");

    // indicator 이동
    const index = Array.from(tabs).indexOf(newTab);
    const tabWidth = tabs[0].offsetWidth;
    indicator.style.transform = `translateY(-50%) translateX(${tabWidth * index}px)`;

    // 배경 변경
    if (newTab.dataset.value === "financial") {
      mainBgLease.classList.remove("active");
      mainBgFinancial.classList.add("active");
      progressBar.style.width = "20%";
    } else {
      mainBgFinancial.classList.remove("active");
      mainBgLease.classList.add("active");
      progressBar.style.width = "40%";
    }
  }

  // 초기 indicator 위치 세팅
  toggleTabs(); // 첫 로드 시도 (리스상품 active 상태 맞추기)

  // 토글탭 전체 클릭 시 동작
  tabWrapper.addEventListener("click", toggleTabs);

  // 닫기 버튼 클릭 이벤트
  document.querySelector("#noticePopup button").addEventListener("click", function () {
    const popup = document.getElementById("noticePopup");
    popup.classList.add("hidden");
  });
});
