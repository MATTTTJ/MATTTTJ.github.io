# 정지훈 포트폴리오

GitHub Pages에 바로 배포할 수 있는 정적 포트폴리오 사이트입니다. 빌드 단계 없이 저장소 루트의 `index.html`을 제공하면 됩니다.

## 로컬 확인

PowerShell에서 아래 명령을 실행한 뒤 브라우저로 `http://localhost:4173`에 접속합니다.

```powershell
python -m http.server 4173
```

## 실제 이미지 교체

현재 Hero에는 `assets/profile-photo.png`를 사용하고 있습니다. 사진을 교체할 때는 같은 파일명을 유지하거나, `index.html`의 이미지 경로와 대체 텍스트를 함께 바꾸면 됩니다.

```html
<img src="assets/profile-photo.png" alt="정지훈 프로필 사진" />
```

프로젝트 카드도 실제 게임 화면이나 YouTube 영상 URL이 준비되면, 해당 카드의 시각 영역과 하단 링크를 교체해 연결할 수 있습니다.

