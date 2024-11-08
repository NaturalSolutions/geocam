from src.worker.process import download_images, process_images


def test_download_images(images):

    names = list(download_images(images))

    for name in names:
        assert "tmp" in name


def test_process_images(images):
    process_images(images=images)
