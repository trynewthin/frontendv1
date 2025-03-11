<script setup>
</script>

<template>
  <v-layout>
    <v-container class="home-view">
      <v-app-bar color="primary" dark>
        <v-app-bar-title>智选车</v-app-bar-title>
      </v-app-bar>
      
      <v-main>
        <v-container>
          <v-card class="mx-auto mt-5" max-width="1000">
            <v-card-title class="text-h4">欢迎使用智选车平台</v-card-title>
            
            <v-card-text>
              <p class="text-body-1">智选车是一个专业的汽车选购平台，为您提供全面的汽车信息和便捷的选车体验。</p>
            </v-card-text>
            
            <v-card-text>
              <v-subheader class="text-h5">系统导航</v-subheader>
              <v-row justify="center" class="mt-3">
                <v-col cols="auto">
                  <v-btn 
                    color="primary" 
                    to="/test" 
                    size="large" 
                    variant="elevated"
                  >
                    功能测试中心
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-container>
      </v-main>
    </v-container>
  </v-layout>
</template>

<style scoped>
/* 特定于首页的样式 */
.content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 3rem 2rem;
}

.home-container {
  width: 100%;
  max-width: 1000px;
  background-color: white;
  padding: 3rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  text-align: center;
}

.introduction {
  margin: 2rem 0;
}

.introduction p {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 2.4rem;
}

h3 {
  margin-top: 0;
  color: #444;
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
}

.links {
  margin-top: 3rem;
  padding: 2.5rem;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.nav-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.nav-link {
  display: inline-block;
  padding: 1rem 2.5rem;
  background-color: #4a9cf6;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #3a8ce6;
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(74, 156, 246, 0.25);
}

@media (max-width: 768px) {
  .content {
    padding: 1.5rem 1rem;
  }
  
  .home-container {
    padding: 2rem 1.5rem;
  }
  
  .links {
    padding: 1.5rem;
    margin-top: 2rem;
  }

  h2 {
    font-size: 2rem;
  }
  
  .introduction p {
    font-size: 1rem;
  }
}
</style> 