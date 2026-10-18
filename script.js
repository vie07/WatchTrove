//data
let daftarFilm = [
    {
        id: 1,
        judul: "Interstellar",
        tipe: "Film",
        genre: "Sci-Fi, Adventure",
        status: "completed",
        rating: 9.5,
        poster: "assets/images/poster-interstellar.jpg"
    },
    {
        id: 2,
        judul: "Stranger Things",
        tipe: "Series",
        genre: "Drama, Sci-Fi",
        status: "watching",
        rating: 8.8,
        poster: "assets/images/poster-stranger-things.jpg"
    },
    {
        id: 3,
        judul: "Spirited Away",
        tipe: "Film",
        genre: "Animasi, Fantasy",
        status: "plan_to_watch",
        rating: 8.6,
        poster: "assets/images/poster-spirited-away.jpg"
    }
];

//total stat
function perbaruiTotalStatistik() {
    let totalSelesai = 0;
    let totalSedang = 0;
    let totalRencana = 0;

    for (let i = 0; i < daftarFilm.length; i++) {
        if (daftarFilm[i].status === "completed") {
            totalSelesai++;
        } else if (daftarFilm[i].status === "watching") {
            totalSedang++;
        } else if (daftarFilm[i].status === "plan_to_watch") {
            totalRencana++;
        }
    }

    //hasil hitungan ke elemen ringkasan dashboard
    document.getElementById("total-selesai").textContent = totalSelesai;
    document.getElementById("total-sedang").textContent = totalSedang;
    document.getElementById("total-rencana").textContent = totalRencana;
}

//render
function renderTabelFilm() {
    const tabelBody = document.getElementById("tabel-film-body");
    if (!tabelBody) return;

    // clear table
    tabelBody.innerHTML = "";

    // Perulangan array of object
    daftarFilm.forEach(function (film, index) {
        // Tentukan teks dan warna badge based status
        let teksBadge = "";
        let kelasBadge = "";

        if (film.status === "completed") {
            teksBadge = "Selesai Ditonton";
            kelasBadge = "bg-success";
        } else if (film.status === "watching") {
            teksBadge = "Sedang Ditonton";
            kelasBadge = "bg-warning text-dark";
        } else {
            teksBadge = "Ingin Ditonton";
            kelasBadge = "bg-info text-dark";
        }

        // Buat baris tabel (tr) secara dinamis
        const baris = document.createElement("tr");
        baris.id = "baris-film-" + film.id;
        baris.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <img src="${film.poster}" alt="Poster ${film.judul}" class="img-thumbnail bg-secondary border-0 p-0" width="50">
            </td>
            <td class="fw-semibold">${film.judul}</td>
            <td><span class="badge bg-secondary">${film.tipe}</span></td>
            <td>${film.genre}</td>
            <td><span class="badge ${kelasBadge}">${teksBadge}</span></td>
            <td><span class="text-warning fw-bold">${film.rating ? film.rating + "/10" : "-"}</span></td>
            <td class="text-center">
                <a href="detail.html" class="btn btn-outline-info btn-sm">Lihat Detail</a>
                <button class="btn btn-outline-danger btn-sm tombol-hapus" data-id="${film.id}">Hapus</button>
            </td>
        `;

        tabelBody.appendChild(baris);
    });

    // Perbarui jumblah
    perbaruiTotalStatistik();
}

// Inisialisasi
if (document.getElementById("tabel-film-body")) {
    renderTabelFilm();
}


// jquarry
$(document).ready(function () {

    // A. Efek Animasi slideToggle
    $("#btn-toggle-form").click(function () {
        $("#kotak-form-tambah").slideToggle(400);
    });

    // B. Event Handling Tombol Hapus pada Baris Tabel dengan Animasi fadeOut
    $(document).on("click", ".tombol-hapus", function () {
        const idYangDihapus = $(this).data("id");
        const barisYangDihapus = $("#baris-film-" + idYangDihapus);

        //confirm
        const yakin = confirm("Apakah yakin ingin menghapus judul ini dari watchlist?");
        if (yakin) {
            //jQuery fadeOut
            barisYangDihapus.fadeOut(400, function () {
                // Hapus item
                daftarFilm = daftarFilm.filter(function (item) {
                    return item.id !== idYangDihapus;
                });

                // Render ulang
                renderTabelFilm();
            });
        }
    });

    // C. Event Handling Submit Formulir Tambah Data & Validasi Input
    $("#form-tambah-film").submit(function (event) {
        event.preventDefault(); // Mencegah reload halaman

        // Ambil nilai dari input
        const judul = $("#title").val().trim();
        const tipe = $("#type").val();
        const genre = $("#genre").val().trim();
        const status = $("#status").val();
        const rating = $("#rating").val();
        let poster = $("#poster_path").val().trim();

        // makesure judul dan tipe tidak kosong
        if (judul === "" || tipe === "") {
            alert("Harap lengkapi judul film dan tipe tontonan!");
            return;
        }

        // Jika path poster kosong, beri gambar default
        if (poster === "") {
            poster = "assets/images/poster-interstellar.jpg";
        }

        // Tipe label yang rapih
        let tipeTeks = "Film";
        if (tipe === "series") {
            tipeTeks = "Series";
        } else if (tipe === "anime") {
            tipeTeks = "Anime";
        }

        // Buat objek film baru
        const filmBaru = {
            id: Date.now(),
            judul: judul,
            tipe: tipeTeks,
            genre: genre !== "" ? genre : "Umum",
            status: status,
            rating: rating !== "" ? parseFloat(rating) : "-",
            poster: poster
        };

        // Tambahkan data baru ke array dummy
        daftarFilm.push(filmBaru);

        // Render ulang tampilan tabel
        renderTabelFilm();

        // Reset form input
        $("#form-tambah-film")[0].reset();

        //fadeIn lalu fadeOut
        $("#pesan-sukses")
            .text("Judul '" + judul + "' berhasil ditambahkan ke watchlist!")
            .fadeIn(400)
            .delay(2000)
            .fadeOut(400);
    });
});