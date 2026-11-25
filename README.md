# M²AdaptVLA

Project page for **M²AdaptVLA: Multimodal Memory-Augmented Vision-Language-Action Model with Predictive Test-Time Adaptation**.

The website includes the abstract, introduction, method, experimental results, demonstration videos, conclusion, and the paper with supplementary material.

## Preview locally

From this directory, run:

```sh
python -m http.server 8000
```

Open <http://localhost:8000/>. No build step or package installation is required.

## Files

- `index.html`: project page, author affiliations, and paper/video links.
- `assets/M2AdaptVLA.pdf`: full paper and supplementary material.
- `assets/figures/`: paper figures and experimental tables.
- `assets/videos/`: presentation and robot demonstrations.
- `static/` and `style.css`: styles, method animation, and table/chart controls.

The presentation video retains its full duration, 1080p resolution, and audio, with a smaller encoding for the repository. Other videos and the PDF match the project-page assets. All page assets use relative paths, and `.nojekyll` supports serving the repository as a static GitHub Pages site.

## Credits

The page adapts the [MemoActPage template](https://github.com/MemoAct-Project/MemoActPage), which credits the [Nerfies website](https://github.com/nerfies/nerfies.github.io), and uses Bulma styles. Third-party notices and licenses are retained in [`static/licenses/`](static/licenses/).
