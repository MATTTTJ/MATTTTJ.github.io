# 정지훈 포트폴리오

GitHub Pages에 바로 배포할 수 있는 정적 포트폴리오 사이트입니다. 빌드 단계 없이 저장소 루트의 `index.html`을 제공하면 됩니다.

## 로컬 확인

PowerShell에서 아래 명령을 실행한 뒤 브라우저로 `http://localhost:4173`에 접속합니다.

```powershell
python -m http.server 4173
```

## 실제 이미지 교체

프로필 사진과 More About Me 자료는 용도별 폴더에서 관리합니다.

- 메인 Hero: `assets/profile-photo-hero.jpg` — 메인용 600×800 프로필 사진
- More About Me: `assets/about/` — 개발 동기, 팀 프로젝트, 제작물 사진과 GIF

사진을 교체할 때는 해당 파일과 `index.html`의 이미지 경로·대체 텍스트를 함께 갱신합니다.

프로젝트 카드도 실제 게임 화면이나 YouTube 영상 URL이 준비되면, 해당 카드의 시각 영역과 하단 링크를 교체해 연결할 수 있습니다.

