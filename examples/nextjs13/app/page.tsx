import { Cli } from "./cli";
export default function Home() {
  const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
  if (!upstashRedisRestUrl) {
    return <div>UPSTASH_REDIS_REST_URL not set </div>;
  }
  const upstashRedisRestToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!upstashRedisRestToken) {
    return <div>UPSTASH_REDIS_REST_TOKEN not set </div>;
  }

  return (
    <main
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit nec elit sit amet lacinia. Maecenas nec
        sem porttitor, porttitor enim quis, suscipit ante. Suspendisse laoreet, neque at pulvinar pulvinar, tortor felis
        aliquet eros, hendrerit ultricies lacus nulla ac sapien. Nam dignissim sem lectus, in fringilla nisl sodales eu.
        Praesent nec maximus ligula. In porta arcu sed arcu varius, nec pellentesque sem finibus. Fusce feugiat
        ultricies mauris, id fringilla augue molestie eget. Sed auctor, dui id volutpat maximus, nunc mauris blandit
        libero, nec consequat lacus elit eget diam. Morbi non fermentum risus, eget auctor urna. Proin fermentum felis
        nec urna sodales, venenatis venenatis magna maximus. Nullam eu arcu nec tellus euismod hendrerit a ac odio.
        Donec sed nibh accumsan neque aliquet maximus. Nam laoreet tortor eu tellus egestas, a tincidunt mauris
        tincidunt. Nulla gravida sapien non finibus fringilla. Aenean in commodo enim. Integer auctor vestibulum lacus,
        vitae maximus ante blandit sed. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
        ridiculus mus. Nulla eleifend, dolor non eleifend varius, arcu libero tempus dolor, sit amet condimentum nibh
        urna vitae est. Quisque ac libero vitae sapien interdum fringilla. Nulla ac elit sed dui egestas interdum et et
        dolor. Suspendisse cursus, lorem et bibendum lacinia, arcu arcu bibendum massa, at ullamcorper lorem eros eu
        quam. Phasellus gravida eget nibh id consequat. Cras porttitor ac arcu a tempor. Curabitur pharetra dui in justo
        malesuada fermentum. Quisque orci arcu, ultrices id vestibulum at, blandit vel eros. Mauris tincidunt urna eget
        mi hendrerit, id tempus massa bibendum. Donec ut fermentum urna. Sed eleifend, risus eu ultrices pulvinar, dui
        ipsum vehicula nulla, in vehicula eros felis ut urna. Nulla odio diam, tincidunt vel ipsum eu, feugiat
        sollicitudin turpis. Donec ac diam in nunc porta commodo et at lacus. Sed a risus molestie metus molestie
        molestie a at sapien. Vivamus at dui eu odio pellentesque porta. Nunc vitae tempus sapien, sit amet ultricies
        turpis. Duis pulvinar rutrum turpis, ac efficitur justo pulvinar at. Quisque in scelerisque dui. Cras maximus,
        urna ut malesuada pharetra, leo nunc pretium mi, eu vehicula justo velit quis lectus. Sed interdum erat sed
        ullamcorper porta. Sed bibendum convallis ipsum, in porttitor tortor tempor sit amet. Vestibulum a tellus non
        arcu porta hendrerit. Cras ultricies non quam ac ullamcorper. Suspendisse fermentum ipsum risus, vel efficitur
        massa fermentum vitae. Mauris rhoncus consequat turpis, quis pellentesque dui elementum ac. In lacinia, mauris
        quis hendrerit eleifend, turpis lorem scelerisque leo, sed tincidunt erat dolor eget erat. Aliquam condimentum
        sapien quis ex bibendum egestas. Nulla eleifend feugiat venenatis. Sed elit lacus, facilisis nec sem non, mollis
        placerat nisi. Sed urna tortor, maximus nec mollis ac, gravida vulputate velit. Suspendisse suscipit viverra
        justo, feugiat elementum erat ornare a. Morbi eu lacinia erat, eget euismod odio. Praesent interdum neque eget
        sem scelerisque, cursus varius libero consectetur. Praesent commodo neque cursus mi sagittis, sed efficitur
        ipsum maximus. Praesent velit mi, pulvinar et convallis ut, faucibus ut est. Donec nec pulvinar nibh. Fusce
        mattis vitae metus at rutrum. Morbi tempus tempor metus, ut dictum justo elementum in. Morbi id aliquam augue,
        nec ornare sapien. Suspendisse sed viverra sem. Nulla facilisis non nibh sed vulputate. Ut suscipit neque sit
        amet ante ullamcorper, nec pretium metus dictum. Sed quis aliquam lacus, dictum efficitur arcu. Nullam finibus,
        nisl vel hendrerit pretium, sem libero luctus ipsum, a facilisis eros nibh ac felis. Nulla aliquet in tortor id
        cursus. Maecenas eget mi sit amet quam pulvinar gravida. Vestibulum iaculis metus purus, nec tempus purus rutrum
        quis. Duis ullamcorper malesuada turpis, in mollis libero blandit in. Aliquam ullamcorper, dolor in aliquam
        iaculis, diam augue vulputate sapien, eu faucibus ligula nisl id ante.
      </p>
      <div
        style={{
          height: "32rem",
          width: "48rem",
        }}
      >
        <Cli url={upstashRedisRestUrl} token={upstashRedisRestToken} />
      </div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit nec elit sit amet lacinia. Maecenas nec
        sem porttitor, porttitor enim quis, suscipit ante. Suspendisse laoreet, neque at pulvinar pulvinar, tortor felis
        aliquet eros, hendrerit ultricies lacus nulla ac sapien. Nam dignissim sem lectus, in fringilla nisl sodales eu.
        Praesent nec maximus ligula. In porta arcu sed arcu varius, nec pellentesque sem finibus. Fusce feugiat
        ultricies mauris, id fringilla augue molestie eget. Sed auctor, dui id volutpat maximus, nunc mauris blandit
        libero, nec consequat lacus elit eget diam. Morbi non fermentum risus, eget auctor urna. Proin fermentum felis
        nec urna sodales, venenatis venenatis magna maximus. Nullam eu arcu nec tellus euismod hendrerit a ac odio.
        Donec sed nibh accumsan neque aliquet maximus. Nam laoreet tortor eu tellus egestas, a tincidunt mauris
        tincidunt. Nulla gravida sapien non finibus fringilla. Aenean in commodo enim. Integer auctor vestibulum lacus,
        vitae maximus ante blandit sed. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
        ridiculus mus. Nulla eleifend, dolor non eleifend varius, arcu libero tempus dolor, sit amet condimentum nibh
        urna vitae est. Quisque ac libero vitae sapien interdum fringilla. Nulla ac elit sed dui egestas interdum et et
        dolor. Suspendisse cursus, lorem et bibendum lacinia, arcu arcu bibendum massa, at ullamcorper lorem eros eu
        quam. Phasellus gravida eget nibh id consequat. Cras porttitor ac arcu a tempor. Curabitur pharetra dui in justo
        malesuada fermentum. Quisque orci arcu, ultrices id vestibulum at, blandit vel eros. Mauris tincidunt urna eget
        mi hendrerit, id tempus massa bibendum. Donec ut fermentum urna. Sed eleifend, risus eu ultrices pulvinar, dui
        ipsum vehicula nulla, in vehicula eros felis ut urna. Nulla odio diam, tincidunt vel ipsum eu, feugiat
        sollicitudin turpis. Donec ac diam in nunc porta commodo et at lacus. Sed a risus molestie metus molestie
        molestie a at sapien. Vivamus at dui eu odio pellentesque porta. Nunc vitae tempus sapien, sit amet ultricies
        turpis. Duis pulvinar rutrum turpis, ac efficitur justo pulvinar at. Quisque in scelerisque dui. Cras maximus,
        urna ut malesuada pharetra, leo nunc pretium mi, eu vehicula justo velit quis lectus. Sed interdum erat sed
        ullamcorper porta. Sed bibendum convallis ipsum, in porttitor tortor tempor sit amet. Vestibulum a tellus non
        arcu porta hendrerit. Cras ultricies non quam ac ullamcorper. Suspendisse fermentum ipsum risus, vel efficitur
        massa fermentum vitae. Mauris rhoncus consequat turpis, quis pellentesque dui elementum ac. In lacinia, mauris
        quis hendrerit eleifend, turpis lorem scelerisque leo, sed tincidunt erat dolor eget erat. Aliquam condimentum
        sapien quis ex bibendum egestas. Nulla eleifend feugiat venenatis. Sed elit lacus, facilisis nec sem non, mollis
        placerat nisi. Sed urna tortor, maximus nec mollis ac, gravida vulputate velit. Suspendisse suscipit viverra
        justo, feugiat elementum erat ornare a. Morbi eu lacinia erat, eget euismod odio. Praesent interdum neque eget
        sem scelerisque, cursus varius libero consectetur. Praesent commodo neque cursus mi sagittis, sed efficitur
        ipsum maximus. Praesent velit mi, pulvinar et convallis ut, faucibus ut est. Donec nec pulvinar nibh. Fusce
        mattis vitae metus at rutrum. Morbi tempus tempor metus, ut dictum justo elementum in. Morbi id aliquam augue,
        nec ornare sapien. Suspendisse sed viverra sem. Nulla facilisis non nibh sed vulputate. Ut suscipit neque sit
        amet ante ullamcorper, nec pretium metus dictum. Sed quis aliquam lacus, dictum efficitur arcu. Nullam finibus,
        nisl vel hendrerit pretium, sem libero luctus ipsum, a facilisis eros nibh ac felis. Nulla aliquet in tortor id
        cursus. Maecenas eget mi sit amet quam pulvinar gravida. Vestibulum iaculis metus purus, nec tempus purus rutrum
        quis. Duis ullamcorper malesuada turpis, in mollis libero blandit in. Aliquam ullamcorper, dolor in aliquam
        iaculis, diam augue vulputate sapien, eu faucibus ligula nisl id ante.
      </p>
    </main>
  );
}
