document.addEventListener('DOMContentLoaded', function() {
    // 使用给出的 URL 读取 zc 文件内容并插入到 <main id="posts-container"> 标签内
    fetch('https://stay206.github.io/xinfan/2025/1/zc')
      .then(response => response.text())
      .then(zcPosts => {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = zcPosts;
        console.log("Posts loaded:", postsContainer.innerHTML); // 调试信息
        // 将内容插入后，继续执行排序和其他功能
        initializePosts();
      })
      .catch(error => {
        console.error('Error fetching the posts:', error);
      });
  
    function initializePosts() {
      let posts = document.querySelectorAll('.post');
      posts.forEach(post => {
        let titleElement = post.querySelector('.post-title h2');
        let subtitleElement = post.querySelector('.post-title h3');
        let title = titleElement ? titleElement.textContent.trim() : "";
        let subtitle = subtitleElement ? subtitleElement.textContent.trim() : "";
        let fullTitle = title + " " + subtitle;
        post.setAttribute('data-title', fullTitle);
  
        let tagsElements = post.querySelectorAll('.tag');
        let tags = Array.from(tagsElements).map(tagElement => tagElement.textContent.trim()).join(',');
        post.setAttribute('data-tags', tags);
  
        let dateElement = post.querySelector('.date-text');
        if (dateElement) {
          let dateText = dateElement.textContent.match(/(\d{4})年(\d{1,2})月(\d{1,2})日?/);
          if (dateText) {
            let year = dateText[1];
            let month = dateText[2].padStart(2, '0'); // 保证月份是两位数
            let day = dateText[3] ? dateText[3].padStart(2, '0') : '99'; // 如果日期部分缺失，默认为99日
            let formattedDate = `${year}-${month}-${day}`;
            post.setAttribute('data-date', formattedDate);
          }
        }
  
        // 读取 data-link 对应的链接，获取 align="center" 中的 src 属性，并赋值到帖子图片的 src 属性中
        let link = post.getAttribute('data-link');
        if (link) {
          fetch(link)
            .then(response => response.text())
            .then(htmlString => {
              let parser = new DOMParser();
              let doc = parser.parseFromString(htmlString, 'text/html');
              let imgElement = doc.querySelector('div[align="center"] img');
              if (imgElement) {
                let src = imgElement.getAttribute('src');
                console.log(`Post link: ${link}, Image src: ${src}`); // 调试信息
                post.querySelector('img').setAttribute('src', src);
              } else {
                console.warn(`No image found for link: ${link}`); // 调试信息
              }
            })
            .catch(error => {
              console.error(`Error fetching image for post ${link}:`, error);
            });
        }
      });
  
      // 调用排序函数
      sortPostsByDate();
      // 调用分页函数
      paginatePosts();
      // 添加点击事件到每个帖子
      addPostClickEvents();
    }
  
    // 搜索功能：根据输入框的值过滤帖子
    document.getElementById('search').addEventListener('input', function() {
      let filter = this.value.toLowerCase();
      let posts = document.querySelectorAll('.post');
      posts.forEach(post => {
        let title = post.getAttribute('data-title').toLowerCase();
        let tags = post.getAttribute('data-tags').toLowerCase();
        if (title.includes(filter) || tags.includes(filter)) {
          post.style.display = '';
        } else {
          post.style.display = 'none';
        }
      });
    });
  
    // 按日期排序帖子
    function sortPostsByDate() {
      let postsContainer = document.getElementById('posts-container');
      let posts = Array.from(postsContainer.getElementsByClassName('post'));
      posts.sort((a, b) => {
        let dateA = new Date(a.getAttribute('data-date'));
        let dateB = new Date(b.getAttribute('data-date'));
        return dateA - dateB;
      });
      posts.forEach(post => postsContainer.appendChild(post));
    }
  
    // 分页功能：将帖子分页显示
    function paginatePosts() {
      const postsPerPage = 10;
      const postsContainer = document.getElementById('posts-container');
      const posts = Array.from(postsContainer.getElementsByClassName('post'));
      const pagination = document.getElementById('pagination');
      const totalPages = Math.ceil(posts.length / postsPerPage);
  
      function showPage(page) {
        posts.forEach((post, index) => {
          post.style.display = (index >= (page - 1) * postsPerPage && index < page * postsPerPage) ? '' : 'none';
        });
        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
          const button = document.createElement('button');
          button.textContent = i;
          button.classList.toggle('disabled', i === page);
          button.addEventListener('click', () => {
            showPage(i);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
          pagination.appendChild(button);
        }
      }
      showPage(1);
    }
  
    // 禁用分页功能：切换分页功能的启用和禁用
    let paginationDisabled = false;
    document.getElementById('disable-pagination-btn').addEventListener('click', function() {
      const posts = document.querySelectorAll('.post');
      if (!paginationDisabled) {
        posts.forEach(post => post.style.display = '');
        document.getElementById('pagination').style.display = 'none';
        this.textContent = '分页显示';
      } else {
        paginatePosts();
        document.getElementById('pagination').style.display = 'flex';
        this.textContent = '全部显示';
      }
      paginationDisabled = !paginationDisabled;
    });
  
    // 返回顶部功能：平滑滚动回到页面顶部
    function gotop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  
    // 确保 "回到顶部" 按钮的点击事件已注册
    document.getElementById('back-to-top').addEventListener('click', gotop);
  
    // 为每个帖子添加点击事件，跳转到不同的指定链接
    function addPostClickEvents() {
      document.querySelectorAll('.post').forEach(post => {
        post.addEventListener('click', function() {
          const link = post.getAttribute('data-link');
          window.open(link, '_blank');
        });
      });
    }
  
    // 切换帖子显示和隐藏状态功能
    document.querySelector('.t-bar-support').addEventListener('click', function() {
      let hiddenPosts = document.querySelectorAll('.post.hidden');
      let tBarSupport = document.querySelector('.t-bar-support');
      if (hiddenPosts.length > 0) {
        // 显示隐藏的帖子
        hiddenPosts.forEach(post => {
          post.classList.remove('hidden');
        });
        tBarSupport.textContent = '隐藏';
      } else {
        // 隐藏原先隐藏的帖子
        let posts = document.querySelectorAll('.post');
        posts.forEach(post => {
          if (post.getAttribute('data-hidden') === 'true') {
            post.classList.add('hidden');
          }
        });
        tBarSupport.textContent = '显示';
      }
    });
  
    // 页面加载时调用排序和分页函数
    sortPostsByDate();
    paginatePosts();
  });
  