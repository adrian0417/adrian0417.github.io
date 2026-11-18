/* =======================================================================
   BASE DE DATOS DE PUBLICACIONES / BLOG
   ======================================================================= */
const seriesData = [
  { id: "tile-painter", title: "Tile Painter 3D", description: "Herramienta de pintado de terreno modular en Unity" },
  { id: "tfg-grafos", title: "TFG: Generador de grafos", description: "Herramienta en Unity para crear y manipular grafos" },
  { id: "otros", title: "Otros" }
];
const postsData = [
  //   {
  //     id: "group-values-load-system",
  //     title: "Arquitectura de un Save System escalable en Unity",
  //     date: "15 Mar 2026",
  //     tags: ["Unity", "C#", "Architecture"],
  //     summary: "Explicación de cómo sustituir PlayerPrefs por contenedores tipo-seguros basados en ScriptableObjects.",
  //     content: `
  //       <h2>1. Introducción al problema</h2>
  //       <p>PlayerPrefs es suficiente para prototipos pequeños, pero carece de estructura cuando escalamos a inventarios o configuraciones avanzadas.</p>

  //       <h2>2. Uso de SimpleGroupValues</h2>
  //       <p>Para guardar valores rápidos con generics tipo-seguros de forma limpia:</p>

  //       <div class="code-block">
  //         <button class="copy-btn" onclick="copyCode(this)">Copy</button>
  //         <pre><code><span class="kw-type">float</span> playerSpeed = <span class="kw-num">7.5f</span>;
  // <span class="kw-func">SimpleGroupValues</span>.Set(<span class="kw-str">"speed"</span>, playerSpeed);</code></pre>
  //       </div>

  //       <p>Y para recuperarlos de forma segura en memoria:</p>

  //       <div class="code-block">
  //         <button class="copy-btn" onclick="copyCode(this)">Copy</button>
  //         <pre><code><span class="kw-type">float</span> currentSpeed = <span class="kw-func">SimpleGroupValues</span>.Get&lt;<span class="kw-type">float</span>&gt;(<span class="kw-str">"speed"</span>);</code></pre>
  //       </div>
  //     `
  //   },
  {
    id: "tile-painter-3d-unity",
    series: "tile-painter",
    title: "01. Tile Painter de bloques en un grid 3D en Unity",
    date: "31 Jul 2026",
    tags: ["Unity", "C#", "Algorithms", "GameDev", "3D"],
    summary: "Diseño e implementación de un algoritmo de autodiseño de terreno 3D basado en Marching Cubes, Bitmasks y Bases Canónicas.",
    content: `
      <h2>1. El reto del terreno modular</h2>
      <p>
        Últimamente me planteaba cómo añadir terreno modular de una forma cómoda en una escena de Unity.
      </p>
      <p>
        Unity cuenta de forma nativa con una herramienta para rellenar un grid 2D. Sin embargo, no tiene sistemas avanzados de relleno de casillas como por ejemplo los que podemos ver en <em>Super Mario Maker</em>.
      </p>
        <!-- FOTO SM -->
      <figure class="post-img-container">
        <img src="./references/tilepainter/SuperMarioMakerForNintendo3DS_MrEraser.gif" alt="Primeros resultados del Tile Painter" class="post-img">
        <figcaption>Grid de Super Mario Maker</figcaption>
      </figure>
      <p>
        Así que se me ocurrió la idea de montar un sistema por mi cuenta. Y bueno... los primeros resultados no fueron precisamente los esperados.
      </p>

      <!-- FOTO 1 -->
      <figure class="post-img-container">
        <img src="./references/tilepainter/foto1.png" alt="Primeros resultados del Tile Painter" class="post-img">
        <figcaption>Figura 1: Primeros intentos de generación de terreno en el grid.</figcaption>
      </figure>

      <h2>2. Adentrándome en los Marching Cubes</h2>
      <p>
        Que algo parezca sencillo no significa que sea fácil. Lo que ocurre es que hay tropecientos casos de conexiones entre los bloques y la lógica para lograr un resultado que satisfaga las restricciones es un pelín más compleja que un simple <code>switch</code> que compara todos los vecinos. De haberlo hecho así, aún estaría programando cada caso en un script interminable.
      </p>
      <p>
        Sin saberlo, me acababa de adentrar en el mundo de los <strong>Marching Cubes</strong>.
      </p>
      
      <blockquote>
        El algoritmo de <strong>Marching Cubes</strong> transforma la información de la superficie de un entorno discreto (valores enteros) en una malla poligonal continua.
      </blockquote>

      <p>
        Varios juegos de destrucción y creación de terreno implementan este algoritmo o variaciones del mismo; por ejemplo, <em>Donkey Kong Bananza</em>, <em>ASTRONEER</em> o <em>Subnautica</em> en sus fases tempranas de desarrollo. No sólo eso: también tiene aplicaciones vitales en el campo de la medicina para la visualización 3D de tomografías (TAC).
      </p>

      <!-- FOTO 2 -->
      <figure class="post-img-container">
        <img src="./references/tilepainter/foto2.png" alt="Ejemplos del algoritmo Marching Cubes" class="post-img">
        <figcaption>Figura 2: Ejemplos del algoritmo Marching Cubes y reconstrucción de mallas.</figcaption>
      </figure>

      

      <h2>3. La estructura lógica: Look Up Tables y Bases Canónicas</h2>
      <p>
        Perfecto, la descripción encajaba con lo que quería hacer: tengo la información de las adyacencias de un bloque central y quiero saber qué tipo de bloque colocar.
      </p>

      <!-- FOTO 3 -->
      <figure class="post-img-container">
        <img src="./references/tilepainter/foto3.png" alt="Información de adyacencias de un bloque" class="post-img">
        <figcaption>Figura 3: Consulta de adyacencias para determinar la topología del bloque.</figcaption>
      </figure>
      <p>
        Lo más conveniente para conocer qué clase de bloque colocar es consultar una especie de <strong>Look Up Table (LUT)</strong> donde estén registrados todos los casos posibles de adyacencias. Es tan sencillo como evaluar los vecinos y preguntarle a una función que traduzca el contexto y devuelva el bloque correcto.
      </p>
      <p>
        ¿Cómo represento las adyacencias? ¿Con una matriz de booleanos? ¿Una matriz cúbica quizás?
      </p>
      <p>
        Sí y no. Para mi solución utilicé matrices cuadradas 3x3 para cada capa (centrándome inicialmente en la capa intermedia). 
        Cada celda guarda un valor booleano (0 o 1). Pero eso no era suficiente. Pongamos el siguiente caso:
      </p>

      <!-- FOTO 4 -->
      <figure class="post-img-container">
        <img src="./references/tilepainter/foto4.png" alt="Caso de esquina en matriz 3x3" class="post-img">
        <figcaption>Figura 4: Ejemplo de grid para un bloque de esquina.</figcaption>
      </figure>

      <p>
        Sabemos que con los bloques adyacentes que rodean al centro debemos rellenar con una <strong>esquina</strong>. Apuntamos el caso a nuestra Look Up Table. Pero... ¿y si tenemos el mismo caso con una rotación de 90°?
      </p>

      <!-- FOTO 5 -->
      <figure class="post-img-container">
        <img src="./references/tilepainter/foto5.png" alt="Caso de esquina rotado 90 grados" class="post-img">
        <figcaption>Figura 5: El mismo caso de esquina tras una rotación de 90°.</figcaption>
      </figure>

      <p>
        Un único caso sencillo pasa a convertirse en 4 casos distintos al considerar las rotaciones de 90°, 180° y 270°. Es una locura intentar registrar cada variante.
      </p>
      <p>
        La solución: el uso de <strong>Bases Canónicas</strong>. Definimos el primer caso como nuestra base canónica. Si recibimos un estado rotado, rotamos la matriz de entrada hasta hacerla coincidir con la base canónica, registrando el número de giros para aplicar la rotación final al prefab o malla.
      </p>

      <p>
        Sin embargo, también hay que contemplar los que denomino <strong>casos espejo</strong>:
      </p>

      <!-- FOTOS 6 Y 7 -->
      <div class="post-img-group">
        <figure class="post-img-container">
          <img src="./references/tilepainter/foto6.png" alt="Caso espejo A" class="post-img">
          <figcaption>Figura 6: Variante simétrica A.</figcaption>
        </figure>
        <figure class="post-img-container">
          <img src="./references/tilepainter/foto7.png" alt="Caso espejo B" class="post-img">
          <figcaption>Figura 7: Variante simétrica B (requiere registro individual).</figcaption>
        </figure>
      </div>
      <p>
      Como contamos con casos simétricos hay que guardarlos de manera individual. Pero quedan incógnitas por resolver.
      </p>
      <p>
      ¿Se va a ir rotando una matriz 90° para cada iteración?¿Se van a comparar las 8 celdas en la LUT?
      </p>

      <h2>4. De la trasposición de matrices a las Bitmasks (O(1))</h2>
      <p>
        Rotar una matriz de booleanos evaluando celda por celda por cada rotación es costoso (O(n)). El peor caso implicaría múltiples comparaciones por cada celda modificada en el editor.
      </p>
      <p>
        Para resolver esto de forma óptima utilizo <strong>Bitmasks (máscaras de bits)</strong>.
      </p>
      <p>
        Cada estado de adyacencia de 8 vecinos se representa visualmente con un número de 8 bits (un byte), donde cada bit indica la presencia (1) o ausencia (0) de un bloque adyacente. La representación visual queda:
      </p>
       <!-- FOTO 8 -->
      <figure class="post-img-container">
        <img src="./references/tilepainter/foto8.png" alt="Representación visual de la Bitmask de 8 bit" class="post-img">
        <figcaption>Figura 8: Representación visual de la Bitmask de 8 bits.</figcaption>
      </figure>

      <p>
      Aplicando el mapeo a nuestro caso de ejemplo queda tal que así:
      </p>
      <!-- FOTO 9 -->
      <figure class="post-img-container">
        <img src="./references/tilepainter/foto9.png" alt="Mapeo de adyacencias 3x3 a una Bitmask de 8 bits." class="post-img">
        <figcaption>Figura 9: Mapeo de adyacencias 3x3 a una Bitmask de 8 bits.</figcaption>
      </figure>
      <p>
      Esto significa que el número que obtenemos por esta bitmask es 128*0 + 1*0 + 2*1 + 4*1 + 8*1 + 16*1 + 32*1 + 64*0 = <strong>62</strong>.
      Este número es el identificador que le dice a la LUT que tiene que devolver una esquina.
      </p>
      <p>
      ¿Y si tiene una rotación aplicada? Sale otro número ¿cómo conseguimos "rotar" a nuestra base canónica?
      </p>
      <p>
      La solución radica en desplazar los bits de nuestra bitmask.
      Así, el número 62 (00111110) equivale a los números 143 (10001111),227 (11100011) y 248 (11111000). El código para desplazar los bits es el siguiente:
      </p>
      <div class="code-block">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code>
<span class="kw-com">// Rotar 90° en una bitmask de 8 bits equivale a desplazar los bits 2 posiciones</span>
<span class="kw-type">int</span> rotatedMask = ((mask &lt;&lt; <span class="kw-num">2</span>) | (mask &gt;&gt; (<span class="kw-num">8</span> - <span class="kw-num">2</span>)));</code></pre>
      </div>

      <p>
        Al desplazar los bits por software mediante operaciones a nivel de bit (bit-shift), rotar 90° pasa a ser una operación casi instantánea. Consultamos la LUT mediante un diccionario o array directo, logrando una complejidad de búsqueda <strong>O(1)</strong>.
      </p>

      <h2>5. Resultado y próximos pasos</h2>
      <p>
        Gracias a esta arquitectura que combina Marching Cubes, Bases Canónicas y Bitmasks se logra una herramienta ágil y fluida para pintar terreno en tiempo real dentro del editor de Unity:
      </p>

      <!-- VIDEO / DEMOSTRACIÓN -->
      <div class="post-video-container">
        <video controls class="post-video" poster="assets/posts/tile-painter/video-poster.png">
          <source src="./references/tilepainter/demo.mp4" type="video/mp4">
          Tu navegador no soporta vídeos HTML5.
        </video>
        <p class="video-caption">Demostración del Tile Painter 3D funcionando en tiempo real en Unity.</p>
      </div>

      <p>
        Pero este no es el final. Queda manejar los casos con distintas alturas, optimizar la generación de mallas combinadas y mucho más. ¡Esto es sólo el principio de la herramienta!
      </p>
    `
  },
  {
    id: "tile-painter-heights-optimization",
    series: "tile-painter",
    title: "02. Tile Painter 3D: Alturas, Bitmasks y Optimizaciones",
    date: "25 Ago 2026",
    tags: ["Unity", "C#", "Algorithms", "Optimization", "GameDev"],
    summary: "Segunda entrega sobre el desarrollo del Tile Painter 3D: gestión de coordenadas en Y, el 'problema de la hamburguesa' con Bitmasks y optimización mediante occlusion culling y mesh bake.",
    content: `
      <h2>1. Introducción</h2>
      <p>
      Después de la primera publicación quedaban distintas implementaciones pendientes por hacer. Por ello, en cuanto terminé de escribir me dispuse a abarcar los nuevos retos propuestos.
      A continuación están descritas cada una de las nuevas adiciones que tiene la herramienta. Además, quedan descritos nuevos problemas que había que superar.
      </p>
      <h2>2. Tamaño del pincel</h2>
      <p>
        Como en toda herramienta de edición de terreno, era indispensable añadir control sobre el radio de acción. Implementé un slider ajustado a un límite máximo de 16x16 bloques para mantener un rendimiento estable durante la pintura continua.
      </p>

      <figure class="post-img-container">
        <img src="./references/tilepainter2/foto1.png" alt="Tamaño del pincel 6x6" class="post-img">
        <figcaption>Figura 1: Vista previa del área de pintado con un pincel de 6x6 bloques.</figcaption>
      </figure>

      <h2>3. Construyendo en la tercera dimensión (Y > 0)</h2>
      <p>
      Sobre cómo se colocan los bloques en el plano es algo de lo que no había hablado antes y este es un buen momento para explicarlo.
        Para posicionar elementos dinámicamente sobre la superficie se requieren dos datos: la altura actual del plano XZ y la proyección del puntero sobre la escena.
      </p>
      <p>
        Mediante <strong>Raycasting</strong> desde la cámara hacia las coordenadas de pantalla del ratón, detectamos si la colisión ocurre contra el plano base (Y=0) o contra un bloque preexistente:
      </p>
      <ul>
        <li><strong>Modo Pintar:</strong> Se toma el punto de impacto y se suma 1 en la coordenada Y.</li>
        <li><strong>Modo Borrar:</strong> Se resta 1 en la coordenada Y sobre el bloque impactado.</li>
      </ul>
      <p>
        Todas las posiciones se redondean y mapean a un <code>Vector3Int</code> para mantener la alineación estricta dentro de la rejilla.
      </p>

      <div class="post-img-group">
        <figure class="post-img-container">
          <img src="./references/tilepainter2/foto2.png" alt="Modo pintar en altura" class="post-img">
          <figcaption>Figura 2A: Adición de bloques en altura.</figcaption>
        </figure>
        <figure class="post-img-container">
          <img src="./references/tilepainter2/foto3.png" alt="Modo borrar en altura" class="post-img">
          <figcaption>Figura 2B: Sustracción de bloques.</figcaption>
        </figure>
      </div>

      <h2>4. Reglas de altura y mejoras QoL</h2>
      <p>
      Añadir altura al pintado de bloques significa añadir complejidad al código. Esto trae consigo una serie de problemas si no se trata como es debido. Por ello he diseñado las siguientes reglas:
       
      </p>
      <ul>
        <li>
        No se permite colocar bloques sin un soporte inferior ni borrar bloques que tengan otros encima.
        </li>
        <li>
        No se puede pintar por debajo de Y=0.
        </li>
        <li>
        Primero se comprobará el tipo de conexiones en las capas superior e inferior del bloque. En caso de no haber ninguna se colocará el bloque usando el mismo procedimiento que se creó en el principio.
        </li>
        <li>
        Para añadir una nueva altura, esta se fijará con un simple click encima de un bloque existente.
        </li>
        <li>
        Siempre que se pueda se intentará optimizar y no pintar el bloque(ver en el apartado de Optimizaciones).
        </li>
      </ul>
      <p></p>
      <p>
      Habiendo fijado estas reglas quedaba manejar el pintado de los bloques. Para ello se han introducido esta mejora respecto al comportamiento base de la herramienta.
        Para facilitar el pintado, al mantener pulsado el clic sobre una altura dada se bloquea la coordenada Y, permitiendo pintar en un único estrato sin desviarse.
      </p>

      <div class="post-video-container">
        <video controls class="post-video">
          <source src="./references/tilepainter2/Demo1.mp4" type="video/mp4">
          Tu navegador no soporta vídeos HTML5.
        </video>
        <p class="video-caption">Demostración: Pintado continuo con bloqueo de altura en Y.</p>
      </div>

      <p>
        Además, por otro lado pero formando parte de las adiciones de QOL amplié el <code>ScriptableObject</code> del catálogo con un inspector personalizado que muestra de forma visual la matriz de conexiones de cada tipo de pieza:
      </p>

      <figure class="post-img-container">
        <img src="./references/tilepainter2/foto4.png" alt="Custom Inspector en ScriptableObject" class="post-img">
        <figcaption>Figura 3: Custom Editor para la representación gráfica de adyacencias.</figcaption>
      </figure>

      <h2>5. Bitmasks de 9 bits y el problema de la "hamburguesa"</h2>
      <p>
Como se mencionó en la <a href="post.html?id=tile-painter-3d-unity">anterior publicación</a>, la resolución de los casos se consigue gracias a una bitmask de 8 bits y una look up table que contemple todos los casos. 
Mi primera solución fue continuar con esta aproximación.<br> Ocurre un pequeño problema. Ahora podemos tener hasta 9 adyacencias para las capas superior e inferior. El bloque del centro puede ser vecino del bloque colocado. 
<br>¿Y ahora qué?<br>
Ahora se hace una bitmask de 9 bits. 
      </p>

      <figure class="post-img-container">
        <img src="./references/tilepainter2/foto5.png" alt="Esquema de Bitmask de 9 bits" class="post-img">
        <figcaption>Figura 4: Layout de adyacencias de 9 bits para capas adyacentes.</figcaption>
      </figure>

      <p>
       Eso pensé de manera inocente. Seguí añadiendo casos para poder pintar los nuevos bloques. No funcionaba del todo o más bien funcionaba raro. Como base canónica aparecían de forma correcta pero al pintar los bloques con otro tipo de rotación estos no se representaban correctamente. 
Apareció el denominado problema de la hamburguesa.<br>
Para los nuevos bloques que quería introducir,la bitmask de la capa media (la primera creada) y la de la capa de arriba eran iguales con un offset de 256 (es el valor extra de la capa de arriba con la adyacencia del bloque central)
Así que mi if statement para esta condición era:
      </p>

      <div class="code-block">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code><span class="kw-com">// Evaluación inicial con incongruencia al rotar</span>
<span class="kw-type">if</span> (Mbitmask == Tbitmask + <span class="kw-num">256</span>) { ... }

<span class="kw-com">// Operación de Shift defectuosa para 9 bits</span>
Mbitmask = (Mbitmask &lt;&lt; <span class="kw-num">2</span>) | (Mbitmask &gt;&gt; <span class="kw-num">6</span>);
Tbitmask = (Tbitmask &lt;&lt; <span class="kw-num">2</span>) | (Mbitmask &gt;&gt; <span class="kw-num">7</span>); <span class="kw-com">// Pérdida de bit de paridad</span></code></pre>
      </div>

      <p>
        Al rotar la máscara, los bits perdían la alineación original con la base canónica, provocando que los bloques rotados se renderizaran con piezas incorrectas (el "efecto hamburguesa").
        </p>
         <figure class="post-img-container">
        <img src="./references/tilepainter2/foto6.png" alt="Problema de la hamburguesa" class="post-img">
        <figcaption>Figura 5: Imagen del problema de la hamburguesa.</figcaption>
      </figure>
        <p>Aquí estaba el verdadero problema. Un simple problema de matemáticas donde no se mantenía la congruencia al finalizar las operaciones.
        Pongamos un ejemplo para ver lo que estaba ocurriendo realmente. Es un fallo que me ha parecido bastante curioso.
        <br>Supongamos que queremos saber qué bloque colocar para el seleccionado:
        </p>
         <div class="post-img-group">
        <figure class="post-img-container">
          <img src="./references/tilepainter2/foto7.png" alt="Modo pintar en altura" class="post-img">
          <figcaption>Figura 7: Case de bloque a resolver.</figcaption>
        </figure>
        <figure class="post-img-container">
          <img src="./references/tilepainter2/foto8.png" alt="Modo borrar en altura" class="post-img">
          <figcaption>Figura 8: Bitmask del bloque.</figcaption>
        </figure>
      </div>
      <p>
      Bien, para la bitmask del medio el número que se obtendría sería 1000 0011 que es equivalente a 131. Para la máscara de arriba el número sería 1 1000 0011 que es equivalente a 387.
      <br> Como es una base canónica hay una diferencia de 256 entre ambos números de bitmask.
      Sin embargo, al rotar(desplazar 2 posiciones a la izquierda los bits) se obtienen 0000 001110 y 0 0000 1111 que son 14 y 15 respectivamente.
      <br> Como se puede observar esa diferencia se ha perdido y ya no se contemplan todas las rotaciones respecto a un caso base.
      </p>

      <h2>6. Solución e implementación de 12 bits</h2>
      <p>
        La solución temporal consistió en mantener la <strong>Bitmask de 8 bits</strong> para las caras laterales y consultar la presencia del bloque superior directamente mediante una lectura booleana simple a la matriz:
      </p>

      <div class="code-block">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code><span class="kw-type">bool</span> hasTopNeighbour = grid.HasBlockAt(x, y + <span class="kw-num">1</span>, z);</code></pre>
      </div>

      <p>
        Para la versión final con soporte completo de cavidades, la arquitectura migrará a usar la siguiente expresión con una trasposición limpia:
      </p>

      <div class="code-block">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        <pre><code><span class="kw-com">// Rotación limpia de 90° en Bitmasks de 12 bits</span>
Mbitmask = (Mbitmask &lt;&lt; <span class="kw-num">2</span>) | (Mbitmask &gt;&gt; <span class="kw-num">6</span>);
Tbitmask = (Tbitmask &lt;&lt; <span class="kw-num">2</span>) | (Mbitmask &gt;&gt; <span class="kw-num">7</span>) | (<span class="kw-num">256</span>&amp; Tbitmask);</code></pre>
      </div>
<p>
<br>
Esto consigue aislar al bit que representa el centro y que siempre haya una diferencia de 256 en el caso de haber una adyacencia con el bloque central superior.
</p>
      <h2>7. Optimizaciones de rendimiento: Occlusion Culling y Mesh Bake</h2>
      <p>
        Para mantener el rendimiento en mapas extensos se implementaron dos técnicas principales:
      </p>

      <h3>Descarte de bloques ocultos</h3>
      <p>
        Si un bloque tiene vecinas ocupadas las máscaras de la capa superior e inferior con un valor de <code>255</code> (completamente rodeado), el sistema evita instanciar su malla, ya que es invisible para el jugador.
      </p>

      <h3>Bake de geometrías y colisionadores</h3>
      <p>
        Al pintar, cada bloque cuenta con su propio <code>BoxCollider</code> individual. Para evitar que la CPU procese cientos de instancias independientes, se integró un sistema de <strong>Bake</strong> que combina todas las mallas en una única geometría con un solo <code>MeshCollider</code>.
      </p>
      <h2>8. Resultado final</h2>
      <p>
      Gracias a todas las nuevas implementaciones el resultado obtenido es el siguiente:


      </p>
 <div class="post-video-container">
        <video controls class="post-video" poster="assets/posts/tile-painter/video-poster.png">
          <source src="./references/tilepainter2/Demo2.mp4" type="video/mp4">
          Tu navegador no soporta vídeos HTML5.
        </video>
        <p class="video-caption">Demostración del nuevo pintado, bake y mesh collider en play mode.</p>
      </div>
      <p>
      Se consigue generar el terreno por un lado. Por el otro se puede hacer un bake y tenerlo listo y optimizado para la build.
      </p>
      <h2>9. Futuro de la herramienta</h2>
      <p>
        Las siguientes fases de desarrollo incluyen:
      </p>
      <ul>
        <li>Soporte para múltiples paletas de bloques en la misma rejilla.</li>
        <li>Objetos decorativos autónomos (cajas, barriles) de tamaño 1x1, 2x1, etc.</li>
        <li>Capa de <em>Decals</em> para el trazado de caminos y detalles de superficie sin alterar el terreno base.</li>
      </ul>
    `
  },
  {
    id: "tfg-generador-grafos-unity",
    series: "tfg-grafos",
    title: "Trabajo de TFG de ingeniería de computadores",
    date: "18 Nov 2026",
    tags: ["Unity", "C#", "Graphs", "Algorithms", "Tools"],
    summary: "Herramienta en Unity que permite manipular los nodos y sus conexiones de un grafo.",
    content: `
    
    <!-- FOTO GRAFO -->
    <figure class="post-img-container">
    <img src="./references/tfgcompu/GrafosIntro.jpg" alt="Grafo generado con la herramienta" class="post-img">
    </figure>
    <h2>Introducción</h2>

      <p>
        Para mi primer TFG de la parte de computadores estoy realizando un proyecto que involucra la algoritmia de grafos. He descubierto todo un mundo alrededor de los grafos y los complejos problemas que los envuelven. Para no volverme loco he desarrollado una herramienta en Unity que permite manipular los nodos y sus conexiones de un grafo según el usuario antoje.
      </p>

      <h2>GraphParameters Editor</h2>
      <!-- FOTO GENERAL FLUJO -->
      <figure class="post-img-container">
        <img src="./references/tfgcompu/flujo.png" alt="Flujo general de la herramienta" class="post-img">
      </figure>

      <p>
        Para ello lo más importante era crear un flujo de trabajo que permita mantener cierta estructura a la hora de manipular grafos. En una ventana de Unity aparecen 6 tabs distintos. Cada uno cuenta con su propia funcionalidad y agrupa lo necesario para que el usuario tenga una interfaz visual con la que tratar los grafos. Por ello voy a ir describiendo lo que hace cada tab.
      </p>

      <h3>Parámetros del grafo</h3>

      <!-- FOTO PARAMETERS -->
      <figure class="post-img-container">
        <img src="./references/tfgcompu/parameters.jpg" alt="Tab de parámetros del grafo" class="post-img">
      </figure>

      <p>
        Este es el primer tab y el más esencial para crear un grafo. Primero se ha de definir el algoritmo a usar por cada grafo. Por el momento hay tres tipos de algoritmos: <strong>Random</strong>, <strong>Greedy</strong> y <strong>Grasp</strong>. Para saber cómo funcionan hay que conocer otra serie de parámetros antes relacionados con los nodos.
      </p>
      <ul>
        <li>Se especifica el número de nodos.</li>
        <li>Luego se dice el número de nodos sueltos. Estos nodos no van a pertenecer a un ciclo de forma estricta.</li>
        <li>Se dice si todos los nodos han de estar conectados. Esto implica no tener diferentes componentes conexas dentro de un mismo grafo.</li>
        <li>Se marca si se quiere que los nodos tengan el número mínimo de adyacencias al conectarse.</li>
        <li>Se especifican cuantos ciclos se crean. El algoritmo automáticamente tomará <code>NodosTotales-NodosSueltos</code> y los dividirá entre <code>NCiclos</code>.</li>
        <li>Se pueden dejar los ciclos abiertos (esto significa que dejan de ser ciclos).</li>
        <li>Se pueden juntar los ciclos con un número de conexiones que se elija (si es mayor que el número de nodos del ciclo se queda con el mínimo valor).</li>
        <li>Si se quiere usar la matriz de afinidad o no(ver el apartado <em>Matriz de Afinidad</em>).</li>
      </ul>

      <h3>Nodos del grafo</h3>

      <!-- FOTO NODES -->
      <figure class="post-img-container">
        <img src="./references/tfgcompu/nodes.jpg" alt="Tab de tipos de nodos" class="post-img">
      </figure>

      <p>
        Posteriormente se crean los tipos de nodos.
        Estos nodos definen la estructura del grafo. Sus campos son nombre, color, si es único y densidad.
      </p>
      <ul>
        <li>El <strong>nombre</strong> sirve para distinguir entre diferentes nodos. El <strong>color</strong> cumple con el mismo propósito para cuando se representan en el visor de grafos.</li>
        <li>El campo <strong>Unique</strong> sirve para que sólo exista una instancia (o ninguna) de ese tipo de nodo.</li>
        <li>La <strong>densidad</strong> es una propiedad especial que indica el porcentaje del tipo de nodo que tiene que estar presente en el grafo.</li>
      </ul>

      <h3>Matriz de Afinidad</h3>

      <!-- FOTO AFFINITY MATRIX -->
      <figure class="post-img-container">
        <img src="./references/tfgcompu/affinity-matrix.jpg" alt="Matriz de afinidad entre tipos de nodo" class="post-img">
      </figure>

      <p>
        En base a los nodos creados se crea la matriz de afinidad. En ella el usuario establece una puntuación para la relación que tienen los nodos entre sí. Va de <strong>-100 a 100</strong> y resulta interesante poner distintos valores para obtener un grafo más variado. Además la matriz también influye bastante en la estructura del grafo.
      </p>

      <h3>Crear el grafo</h3>

      <!-- FOTO CREATE -->
      <figure class="post-img-container">
        <img src="./references/tfgcompu/create.jpg" alt="Tab de creación del grafo" class="post-img">
      </figure>

      <p>
        En este paso se genera un grafo base según los parámetros establecidos en los anteriores pasos.
        Ahora es un buen momento para hablar sobre el tipo de algoritmo seleccionado puesto que importa en la selección del tipo de nodo.
      </p>
      <p>
        El algoritmo <strong>random</strong> tomará nodos de forma aleatoria (cumpliendo con los parámetros establecidos), este grafo generado tendrá una puntuación más baja que los otros algoritmos.
      </p>
      <p>
        El algoritmo <strong>greedy</strong>, como su nombre indica tomará los nodos según vaya viendo una mejor relación entre los mismos. Generalmente aporta mejor puntuación que el anterior.
      </p>
      <p>
        El algoritmo <strong>GRASP</strong>(Greedy Randomized Adaptive Search Procedure) viene con dos campos nuevos. Un valor <strong>Alpha</strong> y un número de iteraciones. El valor Alpha crea una especie nota de corte para seleccionar de forma aleatoria a los nodos candidatos. Como es aleatorio en el cómputo global puede dar mejor resultado en alguna de sus iteraciones. En la mayoría de casos es el que mejor puntuación aporta.
      </p>

      <h3>Restricciones sobre el grafo</h3>

      <!-- FOTO RESTRICTIONS -->
      <figure class="post-img-container">
        <img src="./references/tfgcompu/restrictions.jpg" alt="Tab de restricciones" class="post-img">
      </figure>

      <p>
        Una vez creado el grafo se pueden seguir aplicando restricciones. Estas restricciones permiten al usuario tener una mayor personalización sobre el grafo.
        De la forma en la que funcionan es como bloques que se pueden cambiar. Es decir cada restricción realiza una acción que tiene que cumplirse (o no de forma obligada).
      </p>
      <p>Funciona con la siguiente semántica:</p>
      <blockquote>
        <strong>NodoX</strong> debe/no debe <strong>acción</strong> (sobre <strong>NodoY</strong>).
      </blockquote>
      <p>
        Así existe la restricción de estar(o no estar) dentro de un ciclo, que un nodo esté a una distancia N de otro nodo o que un nodo deba tener cierto número de conexiones.
      </p>
      <p>
        En la descripción de la restricción se explica claramente la acción que realiza.
      </p>
      <p>
        Estas se almacenan en un handler como una lista reordenable y se aplican de arriba hacia abajo. Esto quiere decir que hay veces que no se pueden cumplir todas las restricciones en la primera iteración. De ser así con hacerlo un par de veces más suele bastar.
      </p>

      <h3>Cómo se crean los nodos Topología-&gt;Tipos(con restricciones)</h3>

      <h3>Optimizar el grafo</h3>

      <!-- FOTO OPTIMIZE -->
      <figure class="post-img-container">
        <img src="./references/tfgcompu/optimize.jpg" alt="Tab de optimización del grafo" class="post-img">
      </figure>

      <p>
        Se puede exprimir un poco más de la puntuación del grafo para obtener un mayor resultado.
        Por ello se puede definir el <strong>tipo de mejora</strong>. Esta indica cuando se debe parar la búsqueda de un candidato que mejore la puntuación. Con la <strong>primera mejora</strong> el algoritmo pasa inmediatamente a buscar a otro candidato. Con la <strong>mejor de todas</strong> se itera hasta lograr la máxima puntuación que puede otorgar el candidato disponible.
      </p>
      <p>
        Con el <strong>tipo de movimiento</strong> se puede buscar una estrategia distinta para la optimización. Los tipos de movimientos no añaden ni quitan aristas y nodos. Se trata de modificar las piezas ya existentes que conforman el grafo.
      </p>
      <p>Para cada movimiento existente se tienen que hacer una serie de comprobaciones:</p>
      <ol>
        <li>No se pueden romper ninguna de las restricciones que ya se cumplen actualmente.</li>
        <li>Si han de preservarse los nodos únicos no se pueden quitar nodos únicos que ya existen en el grafo.</li>
        <li>Comprobar que mejora la calidad del grafo en cuanto a afinidad entre nodos.</li>
      </ol>
      <p>
        Un tipo de movimiento que se puede realizar es <strong>cambiar el tipo de nodo</strong> para ganar una mayor afinidad dentro del grafo.
      </p>
      <p>
        Otro tipo de movimiento es <strong>cambiar las aristas</strong> del grafo para que haya conexiones con mayor afinidad entre los nodos.
      </p>

      <h2>Graph Viewer</h2>

      <!-- FOTO GRAPH VIEWER -->
      <figure class="post-img-container">
        <img src="./references/tfgcompu/graph-viewer.png" alt="Ventana Graph Viewer" class="post-img">
      </figure>

      <p>
        Una herramienta que diseñé desde el principio de la vida software de este generador de grafos se trata de Graph Viewer. Permite ver en una ventana aparte el grafo que se ha creado de forma visual.
        Lo primero que se ve al abrir esta ventana es el grafo ya creado mostrando cada nodo con el color asignado a su tipo.
      </p>

      <!-- FOTO TOTAL SCORE DESGLOSADO -->
      <figure class="post-img-container">
        <img src="./references/tfgcompu/total-score.png" alt="Desglose de Total Score" class="post-img">
      </figure>

      <p>
        Más arriba aparece el tab de <strong>Total Score</strong>. Al pinchar en el tab aparece un desglose de la puntuación.
      </p>
      <ul>
        <li>Primero muestra la puntuación obtenida según la afinidad.</li>
        <li>Segundo muestra la puntuación total obtenida según las restricciones.</li>
        <li>Tercero muestra la lista de las restricciones y la puntuación que otorgan en base a su cumplimiento.</li>
      </ul>

      <!-- FOTO PHYSICS SETTINGS DESPLEGADA -->
      <figure class="post-img-container">
        <img src="./references/tfgcompu/physics-settings.png" alt="Ajustes de la simulación del grafo" class="post-img">
      </figure>

      <p>
        Por otro lado hay un desplegable que muestra los ajustes de la simulación del grafo.
      </p>
      <ul>
        <li>Se puede omitir el sentido de las conexiones.</li>
        <li>Se puede mostrar el número de índice del nodo(mayoritariamente usado para depurar).</li>
        <li>Se puede quitar que se actualice forma automática la puntuación para evitar problemas de rendimiento(en casos en los que el grafo sea demasiado grande).</li>
        <li>Se pueden hacer varios ajustes sobre las físicas del grafo(aunque es recomendable dejar los valores por defecto).</li>
      </ul>
    `
  }

];