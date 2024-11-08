from src.deepfaune.predictTools import Predictor
import time

## PREDICTOR OBJECT
LANG = 'fr'
MAXLAG = 20
THRESHOLD = 0.5


def predict(filenames: list):
    predictor = Predictor(filenames, THRESHOLD, LANG)

    ## RUNNING BATCHES OF PREDICTION
    predictor.allBatch()

    ## GETTING THE RESULTS
    ## without using the sequences
    predictedclass_bases, predictedscore_bases = predictor.getPredictions()
    ## or using the sequences
    predictedclasses, predictedscores = predictor.getPredictionsWithSequences(MAXLAG)

    ## OUTPUT
    dates = predictor.getDates()
    seqnum = predictor.getSeqnums()

    result = []
    for filename, date, seq, predictedclass_base, predictedscore_base, predictedclass, predictedscore in zip(filenames, dates, seqnum, predictedclass_bases, predictedscore_bases, predictedclasses, predictedscores):
        result.append({'filename':filename, 'dates':date, 'seqnum':seq, 'predictionbase':predictedclass_base, 'scorebase':predictedscore_base, 'prediction':predictedclass, 'score':predictedscore})
    return result
