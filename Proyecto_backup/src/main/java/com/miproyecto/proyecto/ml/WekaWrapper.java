//=== Source code ===
// MIN NUM OBJ 20
// Generated with Weka 3.8.6
//
// This code is public domain and comes with no warranty.
//
// Timestamp: Sat Oct 25 14:10:58 COT 2025

package com.miproyecto.proyecto.ml; 

import weka.classifiers.AbstractClassifier;
import weka.core.Capabilities;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.RevisionUtils;

public class WekaWrapper
  extends AbstractClassifier {

  /**
   * Returns only the toString() method.
   *
   * @return a string describing the classifier
   */
  public String globalInfo() {
    return toString();
  }

  /**
   * Returns the capabilities of this classifier.
   *
   * @return the capabilities
   */
  public Capabilities getCapabilities() {
    weka.core.Capabilities result = new weka.core.Capabilities(this);

    result.enable(weka.core.Capabilities.Capability.NOMINAL_ATTRIBUTES);
    result.enable(weka.core.Capabilities.Capability.NUMERIC_ATTRIBUTES);
    result.enable(weka.core.Capabilities.Capability.DATE_ATTRIBUTES);
    result.enable(weka.core.Capabilities.Capability.MISSING_VALUES);
    result.enable(weka.core.Capabilities.Capability.NOMINAL_CLASS);
    result.enable(weka.core.Capabilities.Capability.MISSING_CLASS_VALUES);


    result.setMinimumNumberInstances(0);

    return result;
  }

  /**
   * only checks the data against its capabilities.
   *
   * @param i the training data
   */
  public void buildClassifier(Instances i) throws Exception {
    // can classifier handle the data?
    getCapabilities().testWithFail(i);
  }

  /**
   * Classifies the given instance.
   *
   * @param i the instance to classify
   * @return the classification result
   */
  public double classifyInstance(Instance i) throws Exception {
    Object[] s = new Object[i.numAttributes()];
    
    for (int j = 0; j < s.length; j++) {
      if (!i.isMissing(j)) {
        if (i.attribute(j).isNominal())
          s[j] = new String(i.stringValue(j));
        else if (i.attribute(j).isNumeric())
          s[j] = new Double(i.value(j));
      }
    }
    
    // set class value to missing
    s[i.classIndex()] = null;
    
    return WekaModelClassifier.classify(s);
  }

  /**
   * Returns the revision string.
   * 
   * @return        the revision
   */
  public String getRevision() {
    return RevisionUtils.extract("1.0");
  }

  /**
   * Returns only the classnames and what classifier it is based on.
   *
   * @return a short description
   */
  public String toString() {
    return "Auto-generated classifier wrapper, based on weka.classifiers.trees.J48 (generated with Weka 3.8.6).\n" + this.getClass().getName() + "/WekaModelClassifier";
  }

  /**
   * Runs the classfier from commandline.
   *
   * @param args the commandline arguments
   */
  public static void main(String args[]) {
    runClassifier(new WekaWrapper(), args);
  }
}

class WekaModelClassifier {

  public static double classify(Object[] i)
    throws Exception {

    double p = Double.NaN;
    p = WekaModelClassifier.N3bf094581239(i);
    return p;
  }
  static double N3bf094581239(Object []i) {
    double p = Double.NaN;
    if (i[15] == null) {
      p = 0;
    } else if (((Double) i[15]).doubleValue() <= 2.0) {
    p = WekaModelClassifier.N611041141240(i);
    } else if (((Double) i[15]).doubleValue() > 2.0) {
    p = WekaModelClassifier.N36a258d11261(i);
    } 
    return p;
  }
  static double N611041141240(Object []i) {
    double p = Double.NaN;
    if (i[5] == null) {
      p = 0;
    } else if (i[5].equals("0")) {
    p = WekaModelClassifier.N184d719c1241(i);
    } else if (i[5].equals("1")) {
    p = WekaModelClassifier.N693de4d91253(i);
    } 
    return p;
  }
  static double N184d719c1241(Object []i) {
    double p = Double.NaN;
    if (i[9] == null) {
      p = 0;
    } else if (i[9].equals("0")) {
      p = 0;
    } else if (i[9].equals("1")) {
    p = WekaModelClassifier.N6a469c4f1242(i);
    } 
    return p;
  }
  static double N6a469c4f1242(Object []i) {
    double p = Double.NaN;
    if (i[15] == null) {
      p = 0;
    } else if (((Double) i[15]).doubleValue() <= 1.0) {
      p = 0;
    } else if (((Double) i[15]).doubleValue() > 1.0) {
    p = WekaModelClassifier.N55ab870b1243(i);
    } 
    return p;
  }
  static double N55ab870b1243(Object []i) {
    double p = Double.NaN;
    if (i[11] == null) {
      p = 0;
    } else if (i[11].equals("0")) {
    p = WekaModelClassifier.N36d0744b1244(i);
    } else if (i[11].equals("1")) {
      p = 0;
    } 
    return p;
  }
  static double N36d0744b1244(Object []i) {
    double p = Double.NaN;
    if (i[7] == null) {
      p = 0;
    } else if (i[7].equals("0")) {
    p = WekaModelClassifier.N4562229c1245(i);
    } else if (i[7].equals("1")) {
      p = 0;
    } 
    return p;
  }
  static double N4562229c1245(Object []i) {
    double p = Double.NaN;
    if (i[13] == null) {
      p = 0;
    } else if (i[13].equals("0")) {
    p = WekaModelClassifier.N1b186a9b1246(i);
    } else if (i[13].equals("1")) {
    p = WekaModelClassifier.N245a7b5e1252(i);
    } 
    return p;
  }
  static double N1b186a9b1246(Object []i) {
    double p = Double.NaN;
    if (i[10] == null) {
      p = 0;
    } else if (i[10].equals("0")) {
      p = 0;
    } else if (i[10].equals("1")) {
    p = WekaModelClassifier.N1282352c1247(i);
    } 
    return p;
  }
  static double N1282352c1247(Object []i) {
    double p = Double.NaN;
    if (i[4] == null) {
      p = 0;
    } else if (i[4].equals("0")) {
    p = WekaModelClassifier.N2745791b1248(i);
    } else if (i[4].equals("1")) {
      p = 0;
    } 
    return p;
  }
  static double N2745791b1248(Object []i) {
    double p = Double.NaN;
    if (i[12] == null) {
      p = 0;
    } else if (i[12].equals("0")) {
    p = WekaModelClassifier.N7367c9ad1249(i);
    } else if (i[12].equals("1")) {
    p = WekaModelClassifier.N28db42ff1251(i);
    } 
    return p;
  }
  static double N7367c9ad1249(Object []i) {
    double p = Double.NaN;
    if (i[0] == null) {
      p = 0;
    } else if (i[0].equals("Postgrado ")) {
      p = 0;
    } else if (i[0].equals("Técnico ")) {
    p = WekaModelClassifier.N2b7339e81250(i);
    } else if (i[0].equals("Bachiller ")) {
      p = 1;
    } else if (i[0].equals("Doctorado ")) {
      p = 0;
    } 
    return p;
  }
  static double N2b7339e81250(Object []i) {
    double p = Double.NaN;
    if (i[3] == null) {
      p = 1;
    } else if (i[3].equals("0")) {
      p = 1;
    } else if (i[3].equals("1")) {
      p = 0;
    } 
    return p;
  }
  static double N28db42ff1251(Object []i) {
    double p = Double.NaN;
    if (i[2] == null) {
      p = 0;
    } else if (((Double) i[2]).doubleValue() <= 19.0) {
      p = 0;
    } else if (((Double) i[2]).doubleValue() > 19.0) {
      p = 1;
    } 
    return p;
  }
  static double N245a7b5e1252(Object []i) {
    double p = Double.NaN;
    if (i[12] == null) {
      p = 1;
    } else if (i[12].equals("0")) {
      p = 1;
    } else if (i[12].equals("1")) {
      p = 0;
    } 
    return p;
  }
  static double N693de4d91253(Object []i) {
    double p = Double.NaN;
    if (i[9] == null) {
      p = 0;
    } else if (i[9].equals("0")) {
    p = WekaModelClassifier.N5b333c6f1254(i);
    } else if (i[9].equals("1")) {
      p = 1;
    } 
    return p;
  }
  static double N5b333c6f1254(Object []i) {
    double p = Double.NaN;
    if (i[15] == null) {
      p = 0;
    } else if (((Double) i[15]).doubleValue() <= 1.0) {
      p = 0;
    } else if (((Double) i[15]).doubleValue() > 1.0) {
    p = WekaModelClassifier.N298d414c1255(i);
    } 
    return p;
  }
  static double N298d414c1255(Object []i) {
    double p = Double.NaN;
    if (i[13] == null) {
      p = 0;
    } else if (i[13].equals("0")) {
      p = 0;
    } else if (i[13].equals("1")) {
    p = WekaModelClassifier.N5e7a4fa81256(i);
    } 
    return p;
  }
  static double N5e7a4fa81256(Object []i) {
    double p = Double.NaN;
    if (i[14] == null) {
      p = 0;
    } else if (i[14].equals("0")) {
      p = 0;
    } else if (i[14].equals("1")) {
    p = WekaModelClassifier.N586773921257(i);
    } 
    return p;
  }
  static double N586773921257(Object []i) {
    double p = Double.NaN;
    if (i[10] == null) {
      p = 0;
    } else if (i[10].equals("0")) {
      p = 0;
    } else if (i[10].equals("1")) {
    p = WekaModelClassifier.N1a75ecb51258(i);
    } 
    return p;
  }
  static double N1a75ecb51258(Object []i) {
    double p = Double.NaN;
    if (i[12] == null) {
      p = 1;
    } else if (i[12].equals("0")) {
    p = WekaModelClassifier.N59b159961259(i);
    } else if (i[12].equals("1")) {
      p = 0;
    } 
    return p;
  }
  static double N59b159961259(Object []i) {
    double p = Double.NaN;
    if (i[4] == null) {
      p = 1;
    } else if (i[4].equals("0")) {
      p = 1;
    } else if (i[4].equals("1")) {
    p = WekaModelClassifier.N553a4a071260(i);
    } 
    return p;
  }
  static double N553a4a071260(Object []i) {
    double p = Double.NaN;
    if (i[2] == null) {
      p = 0;
    } else if (((Double) i[2]).doubleValue() <= 11.0) {
      p = 0;
    } else if (((Double) i[2]).doubleValue() > 11.0) {
      p = 1;
    } 
    return p;
  }
  static double N36a258d11261(Object []i) {
    double p = Double.NaN;
    if (i[15] == null) {
      p = 1;
    } else if (((Double) i[15]).doubleValue() <= 3.0) {
    p = WekaModelClassifier.N3870af41262(i);
    } else if (((Double) i[15]).doubleValue() > 3.0) {
      p = 1;
    } 
    return p;
  }
  static double N3870af41262(Object []i) {
    double p = Double.NaN;
    if (i[5] == null) {
      p = 1;
    } else if (i[5].equals("0")) {
    p = WekaModelClassifier.N50a99efb1263(i);
    } else if (i[5].equals("1")) {
    p = WekaModelClassifier.N1d5c8d1a1292(i);
    } 
    return p;
  }
  static double N50a99efb1263(Object []i) {
    double p = Double.NaN;
    if (i[9] == null) {
      p = 0;
    } else if (i[9].equals("0")) {
    p = WekaModelClassifier.N57448c9b1264(i);
    } else if (i[9].equals("1")) {
    p = WekaModelClassifier.N4561d6a31283(i);
    } 
    return p;
  }
  static double N57448c9b1264(Object []i) {
    double p = Double.NaN;
    if (i[13] == null) {
      p = 0;
    } else if (i[13].equals("0")) {
    p = WekaModelClassifier.N730422721265(i);
    } else if (i[13].equals("1")) {
    p = WekaModelClassifier.N75bb88991269(i);
    } 
    return p;
  }
  static double N730422721265(Object []i) {
    double p = Double.NaN;
    if (i[3] == null) {
      p = 0;
    } else if (i[3].equals("0")) {
      p = 0;
    } else if (i[3].equals("1")) {
    p = WekaModelClassifier.N48ef464c1266(i);
    } 
    return p;
  }
  static double N48ef464c1266(Object []i) {
    double p = Double.NaN;
    if (i[4] == null) {
      p = 1;
    } else if (i[4].equals("0")) {
    p = WekaModelClassifier.N54ad47ec1267(i);
    } else if (i[4].equals("1")) {
      p = 0;
    } 
    return p;
  }
  static double N54ad47ec1267(Object []i) {
    double p = Double.NaN;
    if (i[7] == null) {
      p = 1;
    } else if (i[7].equals("0")) {
    p = WekaModelClassifier.N277e29b61268(i);
    } else if (i[7].equals("1")) {
      p = 0;
    } 
    return p;
  }
  static double N277e29b61268(Object []i) {
    double p = Double.NaN;
    if (i[11] == null) {
      p = 1;
    } else if (i[11].equals("0")) {
      p = 1;
    } else if (i[11].equals("1")) {
      p = 0;
    } 
    return p;
  }
  static double N75bb88991269(Object []i) {
    double p = Double.NaN;
    if (i[14] == null) {
      p = 0;
    } else if (i[14].equals("0")) {
      p = 0;
    } else if (i[14].equals("1")) {
    p = WekaModelClassifier.N47d46d441270(i);
    } 
    return p;
  }
  static double N47d46d441270(Object []i) {
    double p = Double.NaN;
    if (i[3] == null) {
      p = 0;
    } else if (i[3].equals("0")) {
    p = WekaModelClassifier.N79f8d0751271(i);
    } else if (i[3].equals("1")) {
      p = 1;
    } 
    return p;
  }
  static double N79f8d0751271(Object []i) {
    double p = Double.NaN;
    if (i[10] == null) {
      p = 0;
    } else if (i[10].equals("0")) {
      p = 0;
    } else if (i[10].equals("1")) {
    p = WekaModelClassifier.N2f1d65651272(i);
    } 
    return p;
  }
  static double N2f1d65651272(Object []i) {
    double p = Double.NaN;
    if (i[12] == null) {
      p = 1;
    } else if (i[12].equals("0")) {
    p = WekaModelClassifier.N6cbdf5f1273(i);
    } else if (i[12].equals("1")) {
    p = WekaModelClassifier.N192753421276(i);
    } 
    return p;
  }
  static double N6cbdf5f1273(Object []i) {
    double p = Double.NaN;
    if (i[2] == null) {
      p = 0;
    } else if (((Double) i[2]).doubleValue() <= 5.0) {
      p = 0;
    } else if (((Double) i[2]).doubleValue() > 5.0) {
    p = WekaModelClassifier.N62912c8f1274(i);
    } 
    return p;
  }
  static double N62912c8f1274(Object []i) {
    double p = Double.NaN;
    if (i[7] == null) {
      p = 1;
    } else if (i[7].equals("0")) {
      p = 1;
    } else if (i[7].equals("1")) {
    p = WekaModelClassifier.N5dd533d01275(i);
    } 
    return p;
  }
  static double N5dd533d01275(Object []i) {
    double p = Double.NaN;
    if (i[2] == null) {
      p = 1;
    } else if (((Double) i[2]).doubleValue() <= 19.0) {
      p = 1;
    } else if (((Double) i[2]).doubleValue() > 19.0) {
      p = 0;
    } 
    return p;
  }
  static double N192753421276(Object []i) {
    double p = Double.NaN;
    if (i[0] == null) {
      p = 0;
    } else if (i[0].equals("Postgrado ")) {
    p = WekaModelClassifier.N414e461e1277(i);
    } else if (i[0].equals("Técnico ")) {
    p = WekaModelClassifier.N633e09ab1282(i);
    } else if (i[0].equals("Bachiller ")) {
      p = 1;
    } else if (i[0].equals("Doctorado ")) {
      p = 0;
    } 
    return p;
  }
  static double N414e461e1277(Object []i) {
    double p = Double.NaN;
    if (i[7] == null) {
      p = 1;
    } else if (i[7].equals("0")) {
    p = WekaModelClassifier.N2ad0efec1278(i);
    } else if (i[7].equals("1")) {
    p = WekaModelClassifier.N4e3c200f1281(i);
    } 
    return p;
  }
  static double N2ad0efec1278(Object []i) {
    double p = Double.NaN;
    if (i[11] == null) {
      p = 0;
    } else if (i[11].equals("0")) {
    p = WekaModelClassifier.N5eef12d51279(i);
    } else if (i[11].equals("1")) {
      p = 1;
    } 
    return p;
  }
  static double N5eef12d51279(Object []i) {
    double p = Double.NaN;
    if (i[4] == null) {
      p = 1;
    } else if (i[4].equals("0")) {
      p = 1;
    } else if (i[4].equals("1")) {
    p = WekaModelClassifier.N7d71e7091280(i);
    } 
    return p;
  }
  static double N7d71e7091280(Object []i) {
    double p = Double.NaN;
    if (i[2] == null) {
      p = 0;
    } else if (((Double) i[2]).doubleValue() <= 13.0) {
      p = 0;
    } else if (((Double) i[2]).doubleValue() > 13.0) {
      p = 1;
    } 
    return p;
  }
  static double N4e3c200f1281(Object []i) {
    double p = Double.NaN;
    if (i[2] == null) {
      p = 0;
    } else if (((Double) i[2]).doubleValue() <= 14.0) {
      p = 0;
    } else if (((Double) i[2]).doubleValue() > 14.0) {
      p = 1;
    } 
    return p;
  }
  static double N633e09ab1282(Object []i) {
    double p = Double.NaN;
    if (i[11] == null) {
      p = 1;
    } else if (i[11].equals("0")) {
      p = 1;
    } else if (i[11].equals("1")) {
      p = 0;
    } 
    return p;
  }
  static double N4561d6a31283(Object []i) {
    double p = Double.NaN;
    if (i[10] == null) {
      p = 1;
    } else if (i[10].equals("0")) {
    p = WekaModelClassifier.N37da28a91284(i);
    } else if (i[10].equals("1")) {
      p = 1;
    } 
    return p;
  }
  static double N37da28a91284(Object []i) {
    double p = Double.NaN;
    if (i[13] == null) {
      p = 0;
    } else if (i[13].equals("0")) {
    p = WekaModelClassifier.N18494a051285(i);
    } else if (i[13].equals("1")) {
    p = WekaModelClassifier.N34b2db321290(i);
    } 
    return p;
  }
  static double N18494a051285(Object []i) {
    double p = Double.NaN;
    if (i[14] == null) {
      p = 1;
    } else if (i[14].equals("0")) {
      p = 1;
    } else if (i[14].equals("1")) {
    p = WekaModelClassifier.Nb297bf61286(i);
    } 
    return p;
  }
  static double Nb297bf61286(Object []i) {
    double p = Double.NaN;
    if (i[3] == null) {
      p = 0;
    } else if (i[3].equals("0")) {
    p = WekaModelClassifier.N403670fe1287(i);
    } else if (i[3].equals("1")) {
      p = 1;
    } 
    return p;
  }
  static double N403670fe1287(Object []i) {
    double p = Double.NaN;
    if (i[11] == null) {
      p = 0;
    } else if (i[11].equals("0")) {
    p = WekaModelClassifier.N264f87311288(i);
    } else if (i[11].equals("1")) {
      p = 0;
    } 
    return p;
  }
  static double N264f87311288(Object []i) {
    double p = Double.NaN;
    if (i[0] == null) {
      p = 1;
    } else if (i[0].equals("Postgrado ")) {
    p = WekaModelClassifier.N7484e89f1289(i);
    } else if (i[0].equals("Técnico ")) {
      p = 0;
    } else if (i[0].equals("Bachiller ")) {
      p = 0;
    } else if (i[0].equals("Doctorado ")) {
      p = 0;
    } 
    return p;
  }
  static double N7484e89f1289(Object []i) {
    double p = Double.NaN;
    if (i[12] == null) {
      p = 0;
    } else if (i[12].equals("0")) {
      p = 0;
    } else if (i[12].equals("1")) {
      p = 1;
    } 
    return p;
  }
  static double N34b2db321290(Object []i) {
    double p = Double.NaN;
    if (i[4] == null) {
      p = 1;
    } else if (i[4].equals("0")) {
      p = 1;
    } else if (i[4].equals("1")) {
    p = WekaModelClassifier.N47f0fcda1291(i);
    } 
    return p;
  }
  static double N47f0fcda1291(Object []i) {
    double p = Double.NaN;
    if (i[2] == null) {
      p = 0;
    } else if (((Double) i[2]).doubleValue() <= 14.0) {
      p = 0;
    } else if (((Double) i[2]).doubleValue() > 14.0) {
      p = 1;
    } 
    return p;
  }
  static double N1d5c8d1a1292(Object []i) {
    double p = Double.NaN;
    if (i[13] == null) {
      p = 1;
    } else if (i[13].equals("0")) {
    p = WekaModelClassifier.N4ecf4e3e1293(i);
    } else if (i[13].equals("1")) {
      p = 1;
    } 
    return p;
  }
  static double N4ecf4e3e1293(Object []i) {
    double p = Double.NaN;
    if (i[9] == null) {
      p = 0;
    } else if (i[9].equals("0")) {
      p = 0;
    } else if (i[9].equals("1")) {
      p = 1;
    } 
    return p;
  }
}

