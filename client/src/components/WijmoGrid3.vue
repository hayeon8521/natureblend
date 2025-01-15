<template>
    <div class="container-fluid">
        <!-- the grid -->
        <wj-flex-grid :itemsSource="data" :initialized="flexInitialized" />
        <p>
            The grid now has <span id="rowCount">{{ rowCount }}</span> rows and
            <span id="cellCount">{{ cellCount }}</span> cell elements.
        </p>
    </div>
</template>

<script>
import "@grapecity/wijmo.styles/wijmo.css";
import "bootstrap/dist/css/bootstrap.css";
import { WjFlexGrid } from "@grapecity/wijmo.vue2.grid";
import { setLicenseKey } from "@grapecity/wijmo"; // setLicenseKey 가져오기

// 라이선스 키 설정
setLicenseKey("hayeon8521@kakao.com,E517419476694533#B0HbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPn3UMRRDUqBjN7gmY7FkWpJzUCRGVstWMxZVUoFmSTVDOqlTU4JFd9IlUhNnbpRkcygXc4MGS8hldnNlZysGRMhlNnpGdjBVY7w6YztkRX3WbpVXRtBXTHVmdwkUQrZHNFF7VqlDdrYVMpNDbt54VDFXd8MnRYlUSjVzdUdnNGFETwRVZxZkeXdnSRN5R9R5UlJzZwlUaMd6L82ET4lWVzElQrAnVYFXbLFzcFFHdMhFNpV7TSp5TmVENnd4LHVWdZF7KzU6aoZ7ZCZnT4oFSZVHMSRVdPpmTPRTOOdlMa9WcmJlbFl4Rx8kMvZXTsFlZ43CWkpEZO5UR59UW82WSRJXUtZmUFVGezs4TxY6ZsdTdidkekFlV9VHNJFEdLJTWs3kbKJEe6Znd9RTctRFcNl5NvdTUSBTM5EjdzU5RONVaKNGZnF4bjh6YNBTWnhEd0NUe8R7YiojITJCLicDRBFUR6MDNiojIIJCL8AzN4EzN5czN0IicfJye35XX3JSSwIjUiojIDJCLi86bpNnblRHeFBCI4VWZoNFelxmRg2Wbql6ViojIOJyes4nI5kkTRJiOiMkIsIibvl6cuVGd8VEIgIXZ7VWaWRncvBXZSBybtpWaXJiOi8kI1xSfis4N8gkI0IyQiwiIu3Waz9WZ4hXRgAydvJVa4xWdNBybtpWaXJiOi8kI1xSfiQjR6QkI0IyQiwiIu3Waz9WZ4hXRgACUBx4TgAybtpWaXJiOi8kI1xSfiMzQwIkI0IyQiwiIlJ7bDBybtpWaXJiOi8kI1xSfiUFO7EkI0IyQiwiIu3Waz9WZ4hXRgACdyFGaDxWYpNmbh9WaGBybtpWaXJiOi8kI1tlOiQmcQJCLiUDMwQjNwAiMxITM4IDMyIiOiQncDJCLiETMxATNyAjMiojIwhXRiwiIt36Yu2WYrF6aAFjM5gjbvVWehhmI0ISYONkIsUWdyRnOiwmdFJCLiMzM5QTO6YzN4kTM4cTM5IiOiQWSiwSfdtlOicGbmJCLiIjd4IDMyIiOiIXZ6JLLcN");

export default {
    name: "WijmoGrid3",
    components: {
        WjFlexGrid,
    },
    data() {
        return {
            data: this.getData(100),
            rowCount: 0,
            cellCount: 0,
        };
    },
    methods: {
        flexInitialized(flexgrid) {
            this.rowCount = flexgrid.rows.length;
            this.cellCount = flexgrid.hostElement.querySelectorAll(".wj-cell").length;

            flexgrid.updatedView.addHandler(() => {
                this.rowCount = flexgrid.rows.length;
                this.cellCount = flexgrid.hostElement.querySelectorAll(".wj-cell").length;
            });

            flexgrid.scrollPositionChanged.addHandler(() => {
                if (flexgrid.viewRange.bottomRow >= flexgrid.rows.length - 1) {
                    const view = flexgrid.collectionView;
                    const index = view.currentPosition;
                    this.addData(this.data, 20);
                    view.refresh();
                    view.currentPosition = index;
                }
            });
        },
        getData(cnt, start = 0) {
            const data = [];
            const countries = "USA,Germany,UK,Japan,Italy,Greece".split(",");
            for (let i = 0; i < cnt; i++) {
                data.push({
                    id: i + start,
                    country: countries[i % countries.length],
                    date: new Date(2014, i % 12, i % 28),
                    amount: Math.random() * 10000,
                    active: i % 4 === 0,
                });
            }
            return data;
        },
        addData(data, cnt) {
            const more = this.getData(cnt, data.length);
            data.push(...more);
        },
    },
};
</script>