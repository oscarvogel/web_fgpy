// .eleventy.js
const path = require('path');

module.exports = function(eleventyConfig) {

  // Copia archivos estáticos
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  
  // Watch CSS files for changes
  eleventyConfig.addWatchTarget("src/assets/css/");
  
  // Filtros útiles para SEO
  eleventyConfig.addFilter("dateToRfc3339", dateObj => {
    return new Date(dateObj).toISOString();
  });
  
  eleventyConfig.addFilter("dateToRfc822", dateObj => {
    return new Date(dateObj).toUTCString();
  });
  
  // // Depuración: Verificar datos
  // eleventyConfig.on("eleventy.before", async ({ dir, runMode, outputMode }) => {
  //   const datos = require("./src/_data/proyectos.json");
  //   console.log("Proyectos:", datos);
  // });
  // Filtro para formatear fechas
  eleventyConfig.addFilter("formatDate", (value) => {
    return new Date(value).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  eleventyConfig.addCollection("noticias", function(collection) {
    return collection.getFilteredByGlob("./src/blog/*.md").sort((a, b) => {
      // Ordena por fecha, más antiguos primero
      return new Date(a.data.date) - new Date(b.data.date);
    });
  });
  
  // eleventyConfig.addTransform("dateFormatting", function(content) {
  //   const date = new Date(content.data.date);
  //   content.data.formattedDate = date.toLocaleDateString("es-ES");
  //   return content;
  // });
  eleventyConfig.setDataDeepMerge(true);

  // // Si usas imágenes personalizadas
  // eleventyConfig.addTransform("optimizeImages", async function(content, outputPath) {
  //   if (outputPath.endsWith(".jpg") || outputPath.endsWith(".png")) {
  //     // Configuración de optimización de imágenes
  //   }
  // });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
