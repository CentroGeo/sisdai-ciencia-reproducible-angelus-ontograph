export default [
  {
    path: '/',
    name: 'home',
    components: { main_router: (resolve) => import('../pages/main/ontoGraph.vue').then(resolve) }
  },
  {
    path: '/i',
    name: "datacard",
    components: { main_router: (resolve) => import('../pages/main/ontoData.vue').then(resolve) },
  },
  {
    path: '/dossier',
    name: "entityDossier",
    components: { main_router: (resolve) => import('../pages/main/dossier.vue').then(resolve) },
  },
  { 
    path: '*', 
    components: { main_router: (resolve) => import('../pages/errors/404.vue').then(resolve) } 
  }
]
